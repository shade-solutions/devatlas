#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ELK from 'elkjs/lib/elk.bundled.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

interface RoadmapMeta {
  id: string;
  slug: string;
  title: string;
  type: 'role' | 'skill';
  summary: string;
  [key: string]: any;
}

interface RoadmapNode {
  id: string;
  title: string;
  level: 'B' | 'I' | 'A';
  status: 'core' | 'optional' | 'good-to-know' | 'avoid';
  [key: string]: any;
}

interface RoadmapEdge {
  id: string;
  from: string;
  to: string;
  type: 'requires' | 'optional' | 'related';
  [key: string]: any;
}

interface RoadmapResource {
  id: string;
  title: string;
  type: string;
  url: string;
  [key: string]: any;
}

interface LayoutData {
  algorithm?: string;
  direction?: string;
  breakpoints?: any;
  groups?: any[];
}

interface CompiledRoadmap {
  meta: RoadmapMeta;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  resources: RoadmapResource[];
  layout: LayoutData;
  compiledAt: string;
}

interface ManifestEntry {
  id: string;
  slug: string;
  title: string;
  type: 'role' | 'skill';
  summary: string;
  tags: string[];
  level: string;
  path: string;
}

class RoadmapBuilder {
  private elk = new ELK();
  private manifest: ManifestEntry[] = [];

  private loadJsonFile(filePath: string): any {
    try {
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (error) {
      console.error(`Failed to load ${filePath}:`, error);
      return null;
    }
  }

  private async computeLayout(nodes: RoadmapNode[], edges: RoadmapEdge[], direction: string = 'DOWN'): Promise<any> {
    // Convert to ELK format
    const elkNodes = nodes.map(node => ({
      id: node.id,
      width: 160,
      height: 80,
      labels: [{ text: node.title }]
    }));

    const elkEdges = edges.map(edge => ({
      id: edge.id,
      sources: [edge.from],
      targets: [edge.to]
    }));

    const graph = {
      id: 'root',
      children: elkNodes,
      edges: elkEdges,
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
        'elk.spacing.nodeNode': '80',
        'elk.layered.spacing.nodeNodeBetweenLayers': '80',
        'elk.spacing.edgeNode': '40',
      }
    };

    try {
      const layout = await this.elk.layout(graph);
      
      // Convert back to our format
      const positions: any = {};
      if (layout.children) {
        for (const child of layout.children) {
          positions[child.id] = {
            x: child.x || 0,
            y: child.y || 0,
            width: child.width || 160,
            height: child.height || 80
          };
        }
      }

      return {
        algorithm: 'elk',
        direction: direction === 'DOWN' ? 'TB' : direction === 'UP' ? 'BT' : direction === 'RIGHT' ? 'LR' : 'RL',
        breakpoints: {
          desktop: {
            nodes: positions
          }
        }
      };
    } catch (error) {
      console.error('Failed to compute layout with ELK:', error);
      return null;
    }
  }

  async buildRoadmap(roadmapDir: string): Promise<CompiledRoadmap | null> {
    const roadmapPath = roadmapDir.split('/').slice(-2).join('/');
    console.log(`📦 Building roadmap: ${roadmapPath}`);

    // Load all required files
    const meta = this.loadJsonFile(join(roadmapDir, 'meta.json'));
    const nodes = this.loadJsonFile(join(roadmapDir, 'nodes.json'));
    const edges = this.loadJsonFile(join(roadmapDir, 'edges.json'));
    const resources = this.loadJsonFile(join(roadmapDir, 'resources.json'));

    if (!meta || !nodes || !edges || !resources) {
      console.error(`❌ Failed to load required files for ${roadmapPath}`);
      return null;
    }

    // Load or compute layout
    let layout: LayoutData = {};
    const layoutPath = join(roadmapDir, 'layout.json');
    
    if (existsSync(layoutPath)) {
      console.log(`   Using existing layout.json`);
      layout = this.loadJsonFile(layoutPath) || {};
    } else {
      console.log(`   Computing layout with ELK...`);
      const computedLayout = await this.computeLayout(nodes, edges);
      if (computedLayout) {
        layout = computedLayout;
        // Save computed layout for future use
        writeFileSync(layoutPath, JSON.stringify(layout, null, 2));
        console.log(`   ✅ Generated and saved layout.json`);
      }
    }

    // Create compiled roadmap
    const compiled: CompiledRoadmap = {
      meta,
      nodes,
      edges,
      resources,
      layout,
      compiledAt: new Date().toISOString()
    };

    // Write compiled version
    const compiledPath = join(roadmapDir, 'roadmap.compiled.json');
    writeFileSync(compiledPath, JSON.stringify(compiled, null, 2));

    // Add to manifest
    this.manifest.push({
      id: meta.id,
      slug: meta.slug,
      title: meta.title,
      type: meta.type,
      summary: meta.summary,
      tags: meta.tags || [],
      level: meta.level || 'mixed',
      path: roadmapPath
    });

    console.log(`   ✅ Compiled ${roadmapPath}`);
    return compiled;
  }

  async build() {
    console.log('🚀 Starting roadmap build process...\n');

    const contentDir = join(rootDir, 'content/roadmaps');
    const builtRoadmaps: CompiledRoadmap[] = [];

    try {
      // Find all roadmap directories
      const categories = readdirSync(contentDir);
      
      for (const category of categories) {
        const categoryPath = join(contentDir, category);
        if (!statSync(categoryPath).isDirectory()) continue;

        const roadmaps = readdirSync(categoryPath);
        for (const roadmap of roadmaps) {
          const roadmapPath = join(categoryPath, roadmap);
          if (!statSync(roadmapPath).isDirectory()) continue;

          const compiled = await this.buildRoadmap(roadmapPath);
          if (compiled) {
            builtRoadmaps.push(compiled);
          }
        }
      }

      // Write manifest
      const manifestPath = join(rootDir, 'content/manifest.json');
      writeFileSync(manifestPath, JSON.stringify({
        roadmaps: this.manifest,
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }, null, 2));

      console.log(`\n📊 Build Summary:`);
      console.log(`   Roadmaps built: ${builtRoadmaps.length}`);
      console.log(`   Manifest written: ${manifestPath}`);
      console.log(`\n🎉 Build completed successfully!`);

    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  }
}

// Run build
if (import.meta.url === `file://${process.argv[1]}`) {
  const builder = new RoadmapBuilder();
  builder.build().catch(console.error);
}

export { RoadmapBuilder };