import { readFileSync } from 'fs';
import { join } from 'path';

export interface RoadmapMeta {
  id: string;
  slug: string;
  title: string;
  type: 'role' | 'skill';
  summary: string;
  description?: string;
  tags: string[];
  level: string;
  estimatedDuration?: string;
  version: string;
  authors?: Array<{
    name: string;
    github?: string;
    twitter?: string;
  }>;
}

export interface RoadmapNode {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  level: 'B' | 'I' | 'A';
  status: 'core' | 'optional' | 'good-to-know' | 'avoid';
  tags: string[];
  estimatedTime?: string;
  resources: string[];
  icon?: string;
  group?: string;
  notes?: string;
  deprecated?: boolean;
  prerequisites?: string[];
}

export interface RoadmapEdge {
  id: string;
  from: string;
  to: string;
  type: 'requires' | 'optional' | 'related';
  label?: string;
  weight?: number;
  bidirectional?: boolean;
}

export interface RoadmapResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'documentation' | 'book' | 'course' | 'project' | 'tool' | 'practice';
  url: string;
  description?: string;
  author?: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  language?: string;
  cost?: 'free' | 'paid' | 'freemium';
  rating?: number;
  votes?: number;
  deprecated?: boolean;
  lastUpdated?: string;
}

export interface LayoutData {
  algorithm?: string;
  direction?: string;
  breakpoints?: {
    mobile?: any;
    tablet?: any;
    desktop?: any;
  };
  groups?: Array<{
    id: string;
    title: string;
    nodes: string[];
    color?: string;
    collapsed?: boolean;
  }>;
}

export interface CompiledRoadmap {
  meta: RoadmapMeta;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  resources: RoadmapResource[];
  layout: LayoutData;
  compiledAt: string;
}

export interface ManifestEntry {
  id: string;
  slug: string;
  title: string;
  type: 'role' | 'skill';
  summary: string;
  tags: string[];
  level: string;
  path: string;
}

export interface Manifest {
  roadmaps: ManifestEntry[];
  generatedAt: string;
  version: string;
}

/**
 * Load and parse the roadmaps manifest
 */
export function loadManifest(): Manifest | null {
  try {
    if (typeof window !== 'undefined') {
      // Client-side: fetch from API or static file
      return null; // Will be loaded via route loader
    } else {
      // Server-side: read from file system
      const manifestPath = join(process.cwd(), 'content/manifest.json');
      const content = readFileSync(manifestPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Failed to load manifest:', error);
    return null;
  }
}

/**
 * Load a compiled roadmap by slug
 */
export function loadRoadmap(slug: string): CompiledRoadmap | null {
  try {
    if (typeof window !== 'undefined') {
      // Client-side: this should be called via route loader
      return null;
    } else {
      // Server-side: find and load the roadmap
      const manifest = loadManifest();
      if (!manifest) return null;

      const roadmapEntry = manifest.roadmaps.find(r => r.slug === slug);
      if (!roadmapEntry) return null;

      const roadmapPath = join(process.cwd(), 'content/roadmaps', roadmapEntry.path, 'roadmap.compiled.json');
      const content = readFileSync(roadmapPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Failed to load roadmap ${slug}:`, error);
    return null;
  }
}

/**
 * Get roadmaps by type (role or skill)
 */
export function getRoadmapsByType(manifest: Manifest, type: 'role' | 'skill'): ManifestEntry[] {
  return manifest.roadmaps.filter(roadmap => roadmap.type === type);
}

/**
 * Search roadmaps by query
 */
export function searchRoadmaps(manifest: Manifest, query: string): ManifestEntry[] {
  const lowercaseQuery = query.toLowerCase();
  return manifest.roadmaps.filter(roadmap => 
    roadmap.title.toLowerCase().includes(lowercaseQuery) ||
    roadmap.summary.toLowerCase().includes(lowercaseQuery) ||
    roadmap.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get node by ID from a roadmap
 */
export function getNodeById(roadmap: CompiledRoadmap, nodeId: string): RoadmapNode | undefined {
  return roadmap.nodes.find(node => node.id === nodeId);
}

/**
 * Get resource by ID from a roadmap
 */
export function getResourceById(roadmap: CompiledRoadmap, resourceId: string): RoadmapResource | undefined {
  return roadmap.resources.find(resource => resource.id === resourceId);
}

/**
 * Get all edges connected to a node
 */
export function getNodeEdges(roadmap: CompiledRoadmap, nodeId: string): {
  incoming: RoadmapEdge[];
  outgoing: RoadmapEdge[];
} {
  const incoming = roadmap.edges.filter(edge => edge.to === nodeId);
  const outgoing = roadmap.edges.filter(edge => edge.from === nodeId);
  return { incoming, outgoing };
}

/**
 * Get node prerequisites
 */
export function getNodePrerequisites(roadmap: CompiledRoadmap, nodeId: string): RoadmapNode[] {
  const node = getNodeById(roadmap, nodeId);
  if (!node || !node.prerequisites) return [];
  
  return node.prerequisites
    .map(prereqId => getNodeById(roadmap, prereqId))
    .filter((node): node is RoadmapNode => node !== undefined);
}

/**
 * Get nodes that depend on this node
 */
export function getNodeDependents(roadmap: CompiledRoadmap, nodeId: string): RoadmapNode[] {
  return roadmap.nodes.filter(node => 
    node.prerequisites && node.prerequisites.includes(nodeId)
  );
}

/**
 * Validate roadmap data integrity
 */
export function validateRoadmapIntegrity(roadmap: CompiledRoadmap): string[] {
  const errors: string[] = [];
  
  // Check all edge references
  const nodeIds = new Set(roadmap.nodes.map(n => n.id));
  for (const edge of roadmap.edges) {
    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge ${edge.id} references non-existent source node: ${edge.from}`);
    }
    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge ${edge.id} references non-existent target node: ${edge.to}`);
    }
  }
  
  // Check resource references
  const resourceIds = new Set(roadmap.resources.map(r => r.id));
  for (const node of roadmap.nodes) {
    for (const resourceId of node.resources) {
      if (!resourceIds.has(resourceId)) {
        errors.push(`Node ${node.id} references non-existent resource: ${resourceId}`);
      }
    }
  }
  
  return errors;
}