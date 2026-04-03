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
  const userInteractedRef = useRef(false);
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
          // Mark user-initiated interactions (sourceEvent is null for programmatic calls)
          if (event.sourceEvent) {
            userInteractedRef.current = true;
          }
        });
      svg.call(zoom);
      zoomRef.current = zoom;
    }

    // Auto-fit: ROOT anchored at TOP-CENTER, scale based on HEIGHT so tree grows DOWNWARD
    // Skip if user has manually panned/zoomed — don't hijack their viewport
    const zoom = zoomRef.current;
    if (zoom && !userInteractedRef.current) {
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

    // === GENERATION GUIDE LINES — subtle depth markers ===
    const depthSet = new Set<number>();
    nodes.forEach((d: any) => depthSet.add(d.y));
    const depths = Array.from(depthSet).sort((a, b) => a - b);
    const maxDepthIdx = depths.length - 1;

    const guideSelection = g.selectAll<SVGLineElement, number>('.gen-guide').data(depths);
    guideSelection.exit().remove();
    guideSelection.enter()
      .append('line')
      .attr('class', 'gen-guide')
      .merge(guideSelection as any)
      .attr('x1', (d: any) => {
        let min = Infinity;
        nodes.forEach((n: any) => { if (n.y === d) min = Math.min(min, n.x); });
        return min - 60;
      })
      .attr('x2', (d: any) => {
        let max = -Infinity;
        nodes.forEach((n: any) => { if (n.y === d) max = Math.max(max, n.x); });
        return max + 60;
      })
      .attr('y1', (d) => d)
      .attr('y2', (d) => d)
      .attr('stroke', (_d: any, i: number) => {
        const progress = maxDepthIdx > 0 ? i / maxDepthIdx : 0;
        if (progress < 0.33) return 'rgba(0,240,255,0.04)';
        if (progress < 0.66) return 'rgba(57,255,20,0.04)';
        return 'rgba(168,85,247,0.04)';
      })
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 10');

    // === LINKS — organic S-curve bezier with depth-aware styling ===
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
      .attr('stroke-linecap', 'round')
      .attr('opacity', 0);

    linkEnter
      .merge(linkSelection as any)
      .transition()
      .duration(800)
      .ease(d3.easeCubicInOut)
      .attr('d', (d: any) => {
        const sx = d.source.x, sy = d.source.y;
        const tx = d.target.x, ty = d.target.y;
        // Elegant organic S-curve: control points at 35% and 65% vertically
        const cp1y = sy + (ty - sy) * 0.38;
        const cp2y = sy + (ty - sy) * 0.62;
        return `M${sx},${sy}C${sx},${cp1y} ${tx},${cp2y} ${tx},${ty}`;
      })
      .attr('stroke', (d: any) => {
        const st = d.target.data.data as Strain;
        if (highlightedLineage.length > 0) {
          return highlightedLineage.includes(st.id) ? getNodeColor(st) : 'rgba(20,20,35,0.9)';
        }
        return getNodeColor(st);
      })
      .attr('stroke-width', (d: any) => {
        const target = d.target.data.data as Strain;
        if (target.isExtinct) return 0.8;
        // Thicker links for high-fitness targets — gives visual weight to dominant lineages
        const fitness = target.fitness?.overall ?? 0.5;
        return 1.2 + fitness * 1.6;
      })
      .attr('stroke-dasharray', (d: any) => {
        const target = d.target.data.data as Strain;
        return target.isExtinct ? '2 6' : 'none';
      })
      .attr('opacity', (d: any) => {
        const st = d.target.data.data as Strain;
        if (highlightedLineage.length > 0) {
          return highlightedLineage.includes(st.id) ? 0.95 : 0.04;
        }
        if (st.isExtinct) return 0.18;
        // Deeper nodes slightly more vivid
        const depth = d.target.depth ?? 1;
        return Math.min(0.55 + depth * 0.03, 0.82);
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

    // Ambient outer halo (very diffuse, large)
    nodeEnter
      .filter((d: any) => !(d.data.data as Strain).isExtinct)
      .append('circle')
      .attr('class', 'node-halo')
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 5)
      .attr('fill', (d: any) => getNodeColor(d.data.data))
      .attr('opacity', 0.04);

    // Mid glow ring
    nodeEnter
      .append('circle')
      .attr('class', 'node-glow')
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 2.4)
      .attr('fill', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 'transparent' : getNodeColor(st);
      })
      .attr('opacity', 0.09);

    // Outer ring border (colored, thin) — gives depth
    nodeEnter
      .filter((d: any) => !(d.data.data as Strain).isExtinct)
      .append('circle')
      .attr('class', 'node-ring')
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 1.55)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => getNodeColor(d.data.data))
      .attr('stroke-width', 0.7)
      .attr('stroke-opacity', 0.35)
      .attr('opacity', 0);

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
        return st.parentId === null ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)';
      })
      .attr('stroke-width', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 1.5 : st.parentId === null ? 2 : 0.8;
      })
      .attr('stroke-opacity', 1);

    // Inner specular shine — glassy sphere highlight
    nodeEnter
      .filter((d: any) => !(d.data.data as Strain).isExtinct)
      .append('circle')
      .attr('class', 'node-shine')
      .attr('cx', (d: any) => -(getNodeRadius(d.data.data) * 0.22))
      .attr('cy', (d: any) => -(getNodeRadius(d.data.data) * 0.22))
      .attr('r', 0)
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('pointer-events', 'none');

    // Secondary bottom-right shadow spot
    nodeEnter
      .filter((d: any) => !(d.data.data as Strain).isExtinct)
      .append('circle')
      .attr('class', 'node-shadow-spot')
      .attr('cx', (d: any) => (getNodeRadius(d.data.data) * 0.28))
      .attr('cy', (d: any) => (getNodeRadius(d.data.data) * 0.28))
      .attr('r', 0)
      .attr('fill', 'rgba(0,0,0,0.35)')
      .attr('pointer-events', 'none');

    // Extinct cross-hair lines (X marker)
    nodeEnter
      .filter((d: any) => (d.data.data as Strain).isExtinct)
      .append('line').attr('class', 'extinct-x1')
      .attr('x1', -3.5).attr('y1', -3.5).attr('x2', 3.5).attr('y2', 3.5)
      .attr('stroke', '#6a6a9e').attr('stroke-width', 1.2).attr('stroke-linecap', 'round').attr('opacity', 0);

    nodeEnter
      .filter((d: any) => (d.data.data as Strain).isExtinct)
      .append('line').attr('class', 'extinct-x2')
      .attr('x1', 3.5).attr('y1', -3.5).attr('x2', -3.5).attr('y2', 3.5)
      .attr('stroke', '#6a6a9e').attr('stroke-width', 1.2).attr('stroke-linecap', 'round').attr('opacity', 0);

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
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 1.75)
          .attr('filter', 'url(#node-glow-strong)');
        d3.select(this).select('.node-glow')
          .transition().duration(120)
          .attr('opacity', 0.32)
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 3.8);
        d3.select(this).select('.node-ring')
          .transition().duration(120)
          .attr('opacity', 0.75)
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 2.1)
          .attr('stroke-width', 1.2);
        d3.select(this).select('.node-halo')
          .transition().duration(200)
          .attr('opacity', 0.09)
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 7);
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
            return s.parentId === null ? 'url(#node-glow-root)' : 'url(#node-glow-soft)';
          });
        d3.select(this).select('.node-glow')
          .transition().duration(300)
          .attr('opacity', (dd: any) => {
            const s = dd.data.data as Strain;
            return s.isExtinct ? 0 : s.parentId === null ? 0.22 : 0.09;
          })
          .attr('r', (dd: any) => getNodeRadius(dd.data.data) * 2.4);
        d3.select(this).select('.node-ring')
          .transition().duration(300)
          .attr('opacity', 1);
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
          return highlightedLineage.includes(st.id) ? 1 : 0.08;
        }
        return st.isExtinct ? 0.35 : 1;
      });

    nodeMerge
      .select('.node-main')
      .transition()
      .duration(600)
      .ease(d3.easeBackOut.overshoot(1.4))
      .attr('r', (d: any) => getNodeRadius(d.data.data))
      .attr('fill', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 'transparent' : getNodeColor(st);
      })
      .attr('stroke', (d: any) => {
        const st = d.data.data as Strain;
        if (st.isExtinct) return '#4a4a6e';
        return st.parentId === null ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)';
      })
      .attr('stroke-width', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 1.2 : st.parentId === null ? 2 : 0.8;
      })
      .attr('stroke-opacity', 1)
      .attr('filter', (d: any) => {
        const st = d.data.data as Strain;
        if (st.parentId === null) return 'url(#node-glow-root)';
        if (st.isExtinct) return '';
        return 'url(#node-glow-soft)';
      });

    nodeMerge
      .select('.node-ring')
      .transition().duration(700)
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 1.55)
      .attr('stroke', (d: any) => getNodeColor(d.data.data))
      .attr('opacity', (d: any) => {
        const st = d.data.data as Strain;
        if (highlightedLineage.length > 0) return highlightedLineage.includes(st.id) ? 0.55 : 0;
        return st.parentId === null ? 0.6 : 0.3;
      });

    nodeMerge
      .select('.node-shine')
      .transition().duration(600)
      .attr('cx', (d: any) => -(getNodeRadius(d.data.data) * 0.22))
      .attr('cy', (d: any) => -(getNodeRadius(d.data.data) * 0.22))
      .attr('r', (d: any) => {
        const st = d.data.data as Strain;
        if (st.isExtinct) return 0;
        return getNodeRadius(st) * (st.parentId === null ? 0.28 : 0.32);
      });

    nodeMerge
      .select('.node-shadow-spot')
      .transition().duration(600)
      .attr('cx', (d: any) => (getNodeRadius(d.data.data) * 0.28))
      .attr('cy', (d: any) => (getNodeRadius(d.data.data) * 0.28))
      .attr('r', (d: any) => {
        const st = d.data.data as Strain;
        if (st.isExtinct) return 0;
        return getNodeRadius(st) * 0.38;
      });

    nodeMerge
      .select('.node-halo')
      .transition().duration(800)
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 5)
      .attr('opacity', (d: any) => {
        const st = d.data.data as Strain;
        return st.parentId === null ? 0.06 : 0.025;
      });

    nodeMerge
      .select('.node-glow')
      .transition()
      .duration(600)
      .attr('r', (d: any) => getNodeRadius(d.data.data) * 2.4)
      .attr('fill', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 'transparent' : getNodeColor(st);
      })
      .attr('opacity', (d: any) => {
        const st = d.data.data as Strain;
        return st.isExtinct ? 0 : st.parentId === null ? 0.22 : 0.09;
      });

    nodeMerge.select('.extinct-x1').transition().duration(500).attr('opacity', (d: any) => {
      const st = d.data.data as Strain;
      return st.isExtinct ? 0.6 : 0;
    });
    nodeMerge.select('.extinct-x2').transition().duration(500).attr('opacity', (d: any) => {
      const st = d.data.data as Strain;
      return st.isExtinct ? 0.6 : 0;
    });
  }, [allStrains, currentGeneration, highlightedLineage, onNodeClick]);

  useEffect(() => {
    render();
  }, [render]);

  // Reset user-interaction flag when simulation resets (allStrains cleared)
  useEffect(() => {
    if (allStrains.size === 0) {
      userInteractedRef.current = false;
    }
  }, [allStrains.size]);

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
    userInteractedRef.current = true;
    d3.select<SVGSVGElement, unknown>(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    userInteractedRef.current = true;
    d3.select<SVGSVGElement, unknown>(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };

  const handleZoomReset = () => {
    if (!svgRef.current || !zoomRef.current) return;
    userInteractedRef.current = false; // clear flag so auto-fit runs
    render();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.04) 0%, rgba(4,4,18,0.97) 60%), linear-gradient(180deg, rgba(4,4,16,0.98) 0%, rgba(3,3,12,0.99) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.4)',
      }}
    >
      {/* Dot-grid background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.18 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="tree-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.25)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tree-dots)" />
      </svg>

      {/* SVG filters */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="node-glow-strong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-glow-soft" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-glow-root" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="9" result="outerBlur" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="innerBlur" />
            <feMerge>
              <feMergeNode in="outerBlur" />
              <feMergeNode in="innerBlur" />
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
