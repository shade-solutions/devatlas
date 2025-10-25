import { component$ } from "@builder.io/qwik";
import { qwikify$ } from "@builder.io/qwik-react";
import RoadmapGraphReact from "./Graph.react";

// Qwikify the React component with client-only eagerness
// This tells Qwik to load the component on the client and handle callbacks properly
export const RoadmapGraph = qwikify$(RoadmapGraphReact, {
  eagerness: "visible", // Load when component becomes visible
});

// Props interface for the Qwik wrapper
export interface RoadmapGraphProps {
  nodes: Array<{
    id: string;
    title: string;
    level: 'B' | 'I' | 'A';
    status: 'core' | 'optional' | 'good-to-know' | 'avoid';
    summary?: string;
    estimatedTime?: string;
    tags: string[];
    resources: string[];
    group?: string;
  }>;
  edges: Array<{
    id: string;
    from: string;
    to: string;
    type: 'requires' | 'optional' | 'related';
    label?: string;
  }>;
  layout?: any;
  selectedNodeId?: string;
  onNodeSelect$?: (nodeId: string) => void;
  onToggleProgress$?: (nodeId: string) => void;
  filters?: {
    showOptional?: boolean;
    showDone?: boolean;
    levels?: ('B' | 'I' | 'A')[];
  };
}

// Fallback component for no-JS or loading state
export const RoadmapGraphFallback = component$<RoadmapGraphProps>(({ nodes, edges }) => {
  return (
    <div class="w-full h-full bg-gray-50 p-6 overflow-y-auto">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Roadmap Overview</h2>
          <p class="text-gray-600">Interactive graph loading... Here's a linear view of the roadmap.</p>
        </div>
        
        <div class="space-y-4">
          {nodes.map((node, index) => (
            <div 
              key={node.id}
              class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="text-lg font-medium mr-3 text-gray-500">{index + 1}.</span>
                    <h3 class="text-lg font-semibold text-gray-900">{node.title}</h3>
                    <span class={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded ${
                      node.level === 'B' ? 'bg-green-100 text-green-800' :
                      node.level === 'I' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {node.level === 'B' ? 'Beginner' : node.level === 'I' ? 'Intermediate' : 'Advanced'}
                    </span>
                  </div>
                  
                  {node.summary && (
                    <p class="text-gray-600 text-sm mb-2">{node.summary}</p>
                  )}
                  
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="capitalize">{node.status.replace('-', ' ')}</span>
                    {node.estimatedTime && (
                      <>
                        <span class="mx-2">•</span>
                        <span>{node.estimatedTime}</span>
                      </>
                    )}
                    {node.resources.length > 0 && (
                      <>
                        <span class="mx-2">•</span>
                        <span>{node.resources.length} resources</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div class="ml-4">
                  <div class={`w-4 h-4 rounded ${
                    node.status === 'core' ? 'bg-blue-500' :
                    node.status === 'optional' ? 'bg-green-500' :
                    node.status === 'good-to-know' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {edges.length > 0 && (
          <div class="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Learning Path Connections</h3>
            <p class="text-xs text-gray-600">
              This roadmap has {edges.length} prerequisite relationships to guide your learning sequence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default component$<RoadmapGraphProps>((props) => {
  return (
    <div class="relative w-full h-full">
      {/* React Flow Graph - only loads when needed */}
      <RoadmapGraph {...props} />
      
      {/* Fallback is automatically shown by Qwik during SSR and before hydration */}
      <noscript>
        <RoadmapGraphFallback {...props} />
      </noscript>
    </div>
  );
});