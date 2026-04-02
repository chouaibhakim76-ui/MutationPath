import * as d3 from 'd3';
import { Strain } from '../types';
import { getDominantTrait, traitColor } from './genomeUtils';

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  strain: Strain;
  color: string;
  radius: number;
  opacity: number;
  children: LayoutNode[];
}

export interface LayoutLink {
  source: LayoutNode;
  target: LayoutNode;
  color: string;
  thickness: number;
}

export function buildTreeHierarchy(
  allStrains: Map<string, Strain>
): d3.HierarchyNode<Strain> | null {
  const strains = Array.from(allStrains.values());
  const root = strains.find((s) => s.parentId === null);
  if (!root) return null;

  const buildChildren = (strain: Strain): any => ({
    ...strain,
    childNodes: strain.children
      .map((cid) => allStrains.get(cid))
      .filter(Boolean)
      .map((c) => buildChildren(c!)),
  });

  const hierarchyData = buildChildren(root);

  return d3
    .hierarchy(hierarchyData, (d: any) => d.childNodes)
    .sort((a, b) => (a.data.generation ?? 0) - (b.data.generation ?? 0));
}

export function getNodeColor(strain: Strain): string {
  if (strain.isExtinct) return '#2a2a3a';
  const trait = getDominantTrait(strain.fitness);
  return traitColor(trait);
}

export function getNodeRadius(strain: Strain): number {
  if (strain.isExtinct) return 6; // large enough to click
  if (strain.parentId === null) return 14; // root — big and bold
  // Scale by fitness, with a stronger visual range
  const base = 4.5;
  const fitnessBoost = strain.fitness.overall * 9;
  const childrenBoost = Math.min(strain.children.length * 0.6, 4);
  return base + fitnessBoost + childrenBoost;
}

export function getNodeOpacity(strain: Strain): number {
  return strain.isExtinct ? 0.3 : 0.9;
}

export function getLinkColor(source: Strain, target: Strain): string {
  const sc = getNodeColor(source);
  const tc = getNodeColor(target);
  // Use target color for the link
  return target.isExtinct ? '#1a1a2a' : tc;
}

export function countDescendants(
  strainId: string,
  allStrains: Map<string, Strain>
): number {
  const strain = allStrains.get(strainId);
  if (!strain) return 0;
  let count = 0;
  for (const cid of strain.children) {
    count += 1 + countDescendants(cid, allStrains);
  }
  return count;
}

export function getLineage(
  strainId: string,
  allStrains: Map<string, Strain>
): string[] {
  const lineage: string[] = [strainId];
  let current = allStrains.get(strainId);
  while (current?.parentId) {
    lineage.unshift(current.parentId);
    current = allStrains.get(current.parentId);
  }
  return lineage;
}
