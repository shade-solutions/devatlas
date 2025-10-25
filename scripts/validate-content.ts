#!/usr/bin/env tsx

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load schemas
const schemaDir = join(rootDir, 'content/schemas');
const schemas = {
  meta: JSON.parse(readFileSync(join(schemaDir, 'roadmap.meta.schema.json'), 'utf-8')),
  nodes: JSON.parse(readFileSync(join(schemaDir, 'roadmap.nodes.schema.json'), 'utf-8')),
  edges: JSON.parse(readFileSync(join(schemaDir, 'roadmap.edges.schema.json'), 'utf-8')),
  resources: JSON.parse(readFileSync(join(schemaDir, 'roadmap.resources.schema.json'), 'utf-8')),
  layout: JSON.parse(readFileSync(join(schemaDir, 'roadmap.layout.schema.json'), 'utf-8')),
};

// Compile validators
const validators = {
  meta: ajv.compile(schemas.meta),
  nodes: ajv.compile(schemas.nodes),
  edges: ajv.compile(schemas.edges),
  resources: ajv.compile(schemas.resources),
  layout: ajv.compile(schemas.layout),
};

interface ValidationError {
  file: string;
  type: 'schema' | 'reference' | 'duplicate';
  message: string;
  details?: any;
}

interface RoadmapData {
  meta: any;
  nodes: any[];
  edges: any[];
  resources: any[];
  layout?: any;
}

class ContentValidator {
  private errors: ValidationError[] = [];
  private roadmaps: Map<string, RoadmapData> = new Map();

  addError(error: ValidationError) {
    this.errors.push(error);
    console.error(`❌ ${error.file}: ${error.message}`);
    if (error.details) {
      console.error(`   Details: ${JSON.stringify(error.details, null, 2)}`);
    }
  }

  validateSchema<T>(data: T, validator: any, file: string, type: string): boolean {
    const isValid = validator(data);
    if (!isValid) {
      this.addError({
        file,
        type: 'schema',
        message: `Invalid ${type} schema`,
        details: validator.errors,
      });
      return false;
    }
    return true;
  }

  validateFile(filePath: string, expectedType: keyof typeof validators): any {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (this.validateSchema(data, validators[expectedType], filePath, expectedType)) {
        return data;
      }
      return null;
    } catch (error) {
      this.addError({
        file: filePath,
        type: 'schema',
        message: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      return null;
    }
  }

  validateRoadmap(roadmapDir: string) {
    const roadmapName = roadmapDir.split('/').slice(-2).join('/');
    console.log(`\n🔍 Validating roadmap: ${roadmapName}`);

    const roadmapData: RoadmapData = {
      meta: null,
      nodes: [],
      edges: [],
      resources: [],
    };

    // Validate required files
    const requiredFiles = ['meta.json', 'nodes.json', 'edges.json', 'resources.json'];
    const optionalFiles = ['layout.json'];

    for (const file of requiredFiles) {
      const filePath = join(roadmapDir, file);
      try {
        statSync(filePath);
        const type = file.replace('.json', '') as keyof typeof validators;
        const data = this.validateFile(filePath, type);
        if (data) {
          roadmapData[type] = data;
        }
      } catch {
        this.addError({
          file: roadmapDir,
          type: 'schema',
          message: `Missing required file: ${file}`,
        });
      }
    }

    // Validate optional files
    for (const file of optionalFiles) {
      const filePath = join(roadmapDir, file);
      try {
        statSync(filePath);
        const type = file.replace('.json', '') as keyof typeof validators;
        const data = this.validateFile(filePath, type);
        if (data) {
          roadmapData[type] = data;
        }
      } catch {
        // Optional file missing is OK
      }
    }

    if (roadmapData.meta) {
      this.roadmaps.set(roadmapData.meta.id, roadmapData);
      this.validateRoadmapIntegrity(roadmapData, roadmapName);
    }
  }

  validateRoadmapIntegrity(roadmap: RoadmapData, roadmapName: string) {
    const { meta, nodes, edges, resources } = roadmap;

    if (!meta || !nodes || !edges || !resources) {
      return; // Already reported missing files
    }

    // Check for duplicate IDs within each collection
    this.checkDuplicateIds(nodes, 'nodes', roadmapName);
    this.checkDuplicateIds(edges, 'edges', roadmapName);
    this.checkDuplicateIds(resources, 'resources', roadmapName);

    // Validate edge references
    const nodeIds = new Set(nodes.map((n: any) => n.id));
    for (const edge of edges) {
      if (!nodeIds.has(edge.from)) {
        this.addError({
          file: roadmapName,
          type: 'reference',
          message: `Edge ${edge.id} references non-existent source node: ${edge.from}`,
        });
      }
      if (!nodeIds.has(edge.to)) {
        this.addError({
          file: roadmapName,
          type: 'reference',
          message: `Edge ${edge.id} references non-existent target node: ${edge.to}`,
        });
      }
    }

    // Validate resource references
    const resourceIds = new Set(resources.map((r: any) => r.id));
    for (const node of nodes) {
      if (node.resources) {
        for (const resourceId of node.resources) {
          if (!resourceIds.has(resourceId)) {
            this.addError({
              file: roadmapName,
              type: 'reference',
              message: `Node ${node.id} references non-existent resource: ${resourceId}`,
            });
          }
        }
      }
    }

    // Validate prerequisite references
    for (const node of nodes) {
      if (node.prerequisites) {
        for (const prereqId of node.prerequisites) {
          if (!nodeIds.has(prereqId)) {
            this.addError({
              file: roadmapName,
              type: 'reference',
              message: `Node ${node.id} references non-existent prerequisite: ${prereqId}`,
            });
          }
        }
      }
    }

    console.log(`✅ ${roadmapName}: Basic validation passed`);
  }

  checkDuplicateIds(items: any[], type: string, roadmapName: string) {
    const ids = new Set();
    for (const item of items) {
      if (ids.has(item.id)) {
        this.addError({
          file: roadmapName,
          type: 'duplicate',
          message: `Duplicate ${type} ID: ${item.id}`,
        });
      }
      ids.add(item.id);
    }
  }

  validateGlobalConstraints() {
    console.log('\n🔍 Validating global constraints...');

    // Check for duplicate roadmap IDs across all roadmaps
    const roadmapIds = new Set();
    const roadmapSlugs = new Set();

    for (const [id, roadmap] of this.roadmaps) {
      if (roadmapIds.has(id)) {
        this.addError({
          file: 'global',
          type: 'duplicate',
          message: `Duplicate roadmap ID: ${id}`,
        });
      }
      roadmapIds.add(id);

      if (roadmapSlugs.has(roadmap.meta.slug)) {
        this.addError({
          file: 'global',
          type: 'duplicate',
          message: `Duplicate roadmap slug: ${roadmap.meta.slug}`,
        });
      }
      roadmapSlugs.add(roadmap.meta.slug);
    }

    console.log('✅ Global constraints validated');
  }

  async validate() {
    console.log('🚀 Starting content validation...\n');

    const contentDir = join(rootDir, 'content/roadmaps');
    
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

          this.validateRoadmap(roadmapPath);
        }
      }

      this.validateGlobalConstraints();
    } catch (error) {
      this.addError({
        file: 'global',
        type: 'schema',
        message: `Failed to read content directory: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }

    // Summary
    console.log('\n📊 Validation Summary:');
    console.log(`   Roadmaps processed: ${this.roadmaps.size}`);
    console.log(`   Errors found: ${this.errors.length}`);

    if (this.errors.length === 0) {
      console.log('\n🎉 All content validation passed!');
      process.exit(0);
    } else {
      console.log('\n💥 Content validation failed!');
      console.log('\nErrors by type:');
      const errorsByType = this.errors.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      for (const [type, count] of Object.entries(errorsByType)) {
        console.log(`   ${type}: ${count}`);
      }
      
      process.exit(1);
    }
  }
}

// Run validation
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ContentValidator();
  validator.validate().catch(console.error);
}

export { ContentValidator };