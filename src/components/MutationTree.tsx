import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Strain } from '../types';
import { getNodeColor, getNodeRadius, getLineage } from '../lib/treeLayout';
import NodeTooltip from './NodeTooltip';

interface Props {
  allStrains: Map<string, Strain>;
  currentGeneration: number;
  highlightedLineage: string[];
  onNodeClick: (strainId: string) => void;
}

export default function MutationTree({
  allStrains,
  currentGeneration,
  highlightedLineage,
  onNodeClick,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [tooltip, setTooltip] = useState<{
    strain: Strain;
    x: number;
    y: number;
  } | null>(null);

  const render = useCallback(() => {
    if (!svgRef.current || allStrains.size === 0) return;
    const svg = d3.select(svgRef.current);

    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.attr('width', width).attr('height', height);

    // Find root
    const root = Array.from(allStrains.values()).find((s) => s.parentId === null);
    if (!root) return;

    // Build hierarchy
    const buildHierarchy = (strain: Strain): any => ({
      data: strain,
      children: strain.children
        .map((id) => allStrains.get(id))
        .filter(Boolean)
        .map((s) => buildHierarchy(s!)),
    });

    const hierarchyData = buildHierarchy(root);
    const hierarchy = d3.hierarchy(hierarchyData);

    // Count for dynamic sizing
    const leafCount = hierarchy.leaves().length;
    const treeDepth = hierarchy.height;

    // === TOP-DOWN PHYLOGENETIC TREE — root at top, grows DOWNWARD ===
    // nodeSize guarantees each node has its own horizontal cell
    const nodeW = leafCount > 400 ? 10 : leafCount > 200 ? 14 : leafCount > 100 ? 18 : leafCount > 50 ? 24 : 32;
    // Vertical gap between generations — fixed per level so tree always looks tall
    const nodeH = 88;

    const treeLayout = d3.tree<any>()
      .nodeSize([nodeW, nodeH])
      .separation((a: any, b: any) => {
        const aEx = (a.data.data as Strain).isExtinct;
        const bEx = (b.data.data as Strain).isExtinct;
        const sib = a.parent === b.parent;
        // extinct-extinct: extra gap so they're individually clickable
        if (aEx && bEx) return sib ? 2.5 : 3.5;
        if (aEx || bEx) return sib ? 2.0 : 3.0;
        return sib ? 1.6 : 2.2;
      });

    const treeData = treeLayout(hierarchy as any) as any;
    const nodes: any[] = treeData.descendants();
    const links: any[] = treeData.links();

    // Get or create the main group
    let g = svg.select<SVGGElement>('.tree-group');
    if (g.empty()) {
      g = svg.append('g').attr('class', 'tree-group');
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.05, 10])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      svg.call(zoom);
      zoomRef.current = zoom;
    }

    // Auto-fit: ROOT anchored at TOP-CENTER, scale based on HEIGHT so tree grows DOWNWARD
    const zoom = zoomRef.current;
    if (zoom) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      nodes.forEach((d: any) => {
        minX = Math.min(minX, d.x);
        maxX = Math.max(maxX, d.x);
        minY = Math.min(minY, d.y);
        maxY = Math.max(maxY, d.y);
      });

      const treeH = maxY - minY || 1;
      const padTop = 56;
      const padBottom = 28;
      // Scale so the full DEPTH fills the viewport height — horizontal extent is pannable
      const scale = Math.max(Math.min((height - padTop - padBottom) / treeH, 3), 0.06);
      // Center horizontally on the midpoint of all x-positions
      const cx = (minX + maxX) / 2;

      svg.call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, padTop)   // root lands at top-center
          .scale(scale)
          .translate(-cx, -minY)           // minY is the root's y (0)
      );
    }

    // === GENERATION GUIDE LINES (faint horizontal lines per depth) ===
    const depthSet = new Set<number>();
    nodes.forEach((d: any) => depthSet.add(d.y));
    const depths = Array.from(depthSet).sort((a, b) => a - b);

    const guideSelection = g.selectAll<SVGLineElement, number>('.gen-guide').data(depths);
    guideSelection.exit().remove();
    guideSelection.enter()
      .append('line')
      .attr('class', 'gen-guide')
      .merge(guideSelection as any)
      .attr('x1', (d: any) => {
        let min = Infinity;
        nodes.forEach((n: any) => { if (n.y === d) min = Math.min(min, n.x); });
        return min - 30;
      })
      .attr('x2', (d: any) => {
        let max = -Infinity;
        nodes.forEach((n: any) => { if (n.y === d) max = Math.max(max, n.x); });
        return max + 30;
      })
      .attr('y1', (d) => d)
      .attr('y2', (d) => d)
      .attr('stroke', 'rgba(255,255,255,0.025)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 8');

    // === LINKS — smooth S-curve bezier, like real phylogenetic trees ===
    const linkSelection = g.selectAll<SVGPathElement, any>('.tree-link').data(links, (d: any) => {
      return `${d.source.data.data.id}-${d.target.data.data.id}`;
    });

    linkSelection.exit().transition().duration(300).attr('opacity', 0).remove();

    const linkEnter = linkSelection
      .enter()
      .append('path')
      .attr('class', 'tree-link')
      .attr('d', (d: any) => {
        const sx = d.source.x, sy = d.source.y;
        return `M${sx},${sy}L${sx},${sy}`;
      })
      .attr('fill', 'none')
      .attr('opacity', 0);

    linkEnter
      .merge(linkSelection as any)
      .transition()
      .duration(700)
      .ease(d3.easeCubicInOut)
      .attr('d', (d: any) => {
        const sx = d.source.x, sy = d.source.y;
        const tx = d.target.x, ty = d.target.y;
        // Nextstrain-style: vertical drop then horizontal, with smooth S-curve
        const my = sy + (ty - sy) * 0.5;
        return `M${sx},${sy}C${sx},${my} ${tx},${my} ${tx},${ty}`;
      })
      .attr('stroke', (d: any) => {
        const st = d.target.data.data as Strain;
        if (highlightedLineage.length > 0) {
          return highlightedLineage.includes(st.id) ? getNodeColor(st) : '#111';
        }
        return getNodeColor(st);
      })
      .attr('stroke-width', (d: any) => {
        const target = d.target.data.data as Strain;
        return target.isExtinct ? 0.9 : 1.8;
      })
      .attr('stroke-dasharray', (d: any) => {
        const target = d.target.data.data as Strain;
        return target.isExtinct ? '3 5' : 'none';
      })
      .attr('opacity', (d: any) => {
        const st = d.target.data.data as Strain;
        if (highlightedLineage.length > 0) {
          return highlightedLineage.includes(st.id) ? 0.9 : 0.06;
        }
        return st.isExtinct ? 0.22 : 0.65;
      });

    // === NODES ===
    const nodeSelection = g.selectAll<SVGGElement, any>('.tree-node').data(nodes, (d: any) => {
      return d.data.data.id;
    });

    nodeSelection.exit().transition().duration(500).attr('opacity', 0).remove();

    const nodeEnter = nodeSelection
      .enter()
      .append('g')
      .attr('class', 'tree-node')
      .attr('transform', (d: any) => `translate(${d.parent ? d.parent.x : d.x},${d.parent ? d.parent.y : d.y})`)
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    // Outer glow ring
    nodeEnter
      .append('circle')
      .attr('class', 'node-glow')
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 2.8)
      .attr('fill', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 'transparent' : getNodeColor(st);
      })
      .attr('opacity', 0.07);

    // Main node circle
    nodeEnter
      .append('circle')
      .attr('class', 'node-main')
      .attr('r', 0)
      .attr('fill', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 'transparent' : getNodeColor(st);
      })
      .attr('stroke', (d: any) => {
        const st = d.data.data as Strain;
        if (st.isExtinct) return '#4a4a6e';
        return st.parentId === null ? getNodeColor(st) : 'rgba(255,255,255,0.12)';
      })
      .attr('stroke-width', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 1.5 : st.parentId === null ? 2.5 : 1;
      })
      .attr('stroke-opacity', 1);

    // Inner specular shine for live nodes (3D sphere effect)
    nodeEnter
      .filter((d: any) => !(d.data.data as Strain).isExtinct)
      .append('circle')
      .attr('class', 'node-shine')
      .attr('cx', -1.2).attr('cy', -1.2)
      .attr('r', 0)
      .attr('fill', 'rgba(255,255,255,0.42)')
      .attr('pointer-events', 'none');

    // Extinct cross-hair lines (X marker)
    nodeEnter
      .filter((d: any) => (d.data.data as Strain).isExtinct)
      .append('line').attr('class', 'extinct-x1')
      .attr('x1', -3.5).attr('y1', -3.5).attr('x2', 3.5).attr('y2', 3.5)
      .attr('stroke', '#5a5a80').attr('stroke-width', 1.4).attr('stroke-linecap', 'round').attr('opacity', 0);

    nodeEnter
      .filter((d: any) => (d.data.data as Strain).isExtinct)
      .append('line').attr('class', 'extinct-x2')
      .attr('x1', 3.5).attr('y1', -3.5).attr('x2', -3.5).attr('y2', 3.5)
      .attr('stroke', '#5a5a80').attr('stroke-width', 1.4).attr('stroke-linecap', 'round').attr('opacity', 0);

    // Events
    nodeEnter
      .on('mouseenter', function (event: MouseEvent, d: any) {
        setTooltip({
          strain: d.data.data,
          x: event.clientX,
          y: event.clientY,
        });
        d3.select(this).select('.node-main')
          .transition().duration(120)
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 1.8)
          .attr('filter', 'url(#node-glow-strong)');
        d3.select(this).select('.node-glow')
          .transition().duration(120)
          .attr('opacity', 0.38)
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 4);
      })
      .on('mousemove', function (event: MouseEvent, d: any) {
        setTooltip({
          strain: d.data.data,
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mouseleave', function () {
        setTooltip(null);
        d3.select(this).select('.node-main')
          .transition().duration(300)
          .attr('r', (dd: any) => getNodeRadius(dd.data.data))
          .attr('filter', (dd: any) => {
            const s = dd.data.data as Strain;
            return s.parentId === null ? 'url(#node-glow-strong)' : '';
          });
        d3.select(this).select('.node-glow')
          .transition().duration(300)
          .attr('opacity', (dd: any) => {
            const s = dd.data.data as Strain;
            return s.isExtinct ? 0 : s.parentId === null ? 0.28 : 0.12;
          })
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 2.8);
      })
      .on('click', function (_event: MouseEvent, d: any) {
        onNodeClick(d.data.data.id);
      });

    // Merge
    const nodeMerge = nodeEnter.merge(nodeSelection as any);

    nodeMerge
      .transition()
      .duration(700)
      .ease(d3.easeCubicInOut)
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .attr('opacity', (d: any) => {
        const st = d.data.data as Strain;
        if (highlightedLineage.length > 0) {
          return highlightedLineage.includes(st.id) ? 1 : 0.1;
        }
        return st.isExtinct ? 0.4 : 1;
      });

    nodeMerge
      .select('.node-main')
      .transition()
      .duration(600)
      .ease(d3.easeBackOut.overshoot(1.5))
      .attr('r', (d: any) => getNodeRadius(d.data.data))
      .attr('fill', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 'transparent' : getNodeColor(st);
      })
      .attr('stroke', (d: any) => {
        const st = d.data.data as Strain;
        if (st.isExtinct) return '#4a4a6e';
        return st.parentId === null ? getNodeColor(st) : 'rgba(255,255,255,0.12)';
      })
      .attr('stroke-width', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 1.5 : st.parentId === null ? 2.5 : 1;
      })
      .attr('stroke-opacity', 1)
      .attr('filter', (d: any) => {
        const st = d.data.data as Strain;
        if (st.parentId === null) return 'url(#node-glow-strong)';
        if (st.isExtinct) return '';
        return 'url(#node-glow-soft)';
      });

    nodeMerge
      .select('.node-shine')
      .transition().duration(600)
      .attr('r', (d: any) => {
        const st = d.data.data as Strain;
        if (st.isExtinct || st.parentId === null) return 0;
        return getNodeRadius(st) * 0.3;
      });

    nodeMerge.select('.extinct-x1').transition().duration(500).attr('opacity', (d: any) => {
      const st = d.data.data as Strain;
      return st.isExtinct ? 0.7 : 0;
    });
    nodeMerge.select('.extinct-x2').transition().duration(500).attr('opacity', (d: any) => {
      const st = d.data.data as Strain;
      return st.isExtinct ? 0.7 : 0;
    });

    nodeMerge
      .select('.node-glow')
      .transition()
      .duration(600)
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 2.8)
      .attr('fill', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 'transparent' : getNodeColor(st);
      })
      .attr('opacity', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 0 : st.parentId === null ? 0.28 : 0.12;
      });
  }, [allStrains, currentGeneration, highlightedLineage, onNodeClick]);

  useEffect(() => {
    render();
  }, [render]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => render());
    ro.observe(container);
    return () => ro.disconnect();
  }, [render]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select<SVGSVGElement, unknown>(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select<SVGSVGElement, unknown>(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };

  const handleZoomReset = () => {
    if (!svgRef.current || !zoomRef.current) return;
    render(); // just re-render to auto-fit
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(4,4,14,0.95) 0%, rgba(6,6,20,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* SVG filters */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="node-glow-strong" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-glow-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <svg ref={svgRef} className="w-full h-full" />

      {/* Generation counter */}
      {currentGeneration > 0 && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-xs px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(0,240,255,0.06)',
            border: '1px solid rgba(0,240,255,0.15)',
            boxShadow: '0 0 16px rgba(0,240,255,0.08)',
          }}
        >
          <span className="text-cyan font-semibold">GEN</span>
          <span className="text-white ml-1.5 font-semibold">{currentGeneration}</span>
        </div>
      )}

      {/* Legend */}
      <div
        className="absolute top-3 right-3 rounded-xl p-3 text-[10px] space-y-1.5"
        style={{ background: 'rgba(4,4,16,0.88)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
      >
        <div className="font-mono text-[9px] tracking-[0.25em] text-text-secondary/60 mb-2.5">TRAIT MAP</div>
        {[
          { color: '#00f0ff', label: 'Transmissibility' },
          { color: '#39ff14', label: 'Immune Evasion' },
          { color: '#ff1744', label: 'Virulence' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span className="text-text-secondary">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-0.5 pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0 border" style={{ background: 'transparent', borderColor: '#4a4a6e' }} />
          <span className="text-text-secondary/60">Extinct</span>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        {[
          { label: '+', fn: handleZoomIn },
          { label: '−', fn: handleZoomOut },
          { label: '⊙', fn: handleZoomReset },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.fn}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-text-secondary hover:text-cyan font-bold text-base btn-3d"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {allStrains.size === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-4 opacity-20">
              <circle cx="24" cy="24" r="20" stroke="#8888a0" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="24" cy="24" r="4" fill="#8888a0" opacity="0.3" />
              <line x1="24" y1="4" x2="24" y2="10" stroke="#8888a0" strokeWidth="0.8" opacity="0.3" />
              <line x1="24" y1="38" x2="24" y2="44" stroke="#8888a0" strokeWidth="0.8" opacity="0.3" />
              <line x1="4" y1="24" x2="10" y2="24" stroke="#8888a0" strokeWidth="0.8" opacity="0.3" />
              <line x1="38" y1="24" x2="44" y2="24" stroke="#8888a0" strokeWidth="0.8" opacity="0.3" />
            </svg>
            <p className="font-display text-text-secondary/40 text-xs tracking-wider">
              SELECT A VIRUS TO BEGIN
            </p>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <NodeTooltip
          strain={tooltip.strain}
          x={tooltip.x}
          y={tooltip.y}
          allStrains={allStrains}
        />
      )}
    </div>
  );
}
