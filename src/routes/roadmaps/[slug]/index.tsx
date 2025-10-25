import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { loadRoadmap, getNodeById, type CompiledRoadmap } from "../../../utils/content";
import RoadmapGraph from "../../../components/roadmap/Graph";

interface RoadmapPageProps {
  roadmap: CompiledRoadmap;
}

export const useRoadmapLoader = routeLoader$<CompiledRoadmap | null>(({ params }) => {
  return loadRoadmap(params.slug);
});

export default component$(() => {
  const roadmap = useRoadmapLoader();
  const location = useLocation();
  const selectedNodeId = useSignal<string | null>(null);
  const viewMode = useSignal<'graph' | 'list'>('graph');
  const isPrintMode = useSignal(false);
  const showOptional = useSignal(true);
  const selectedLevels = useSignal<('B' | 'I' | 'A')[]>(['B', 'I', 'A']);

  // Parse URL parameters
  useVisibleTask$(() => {
    const urlParams = new URLSearchParams(location.url.search);
    const nodeParam = urlParams.get('node');
    const viewParam = urlParams.get('view') as 'graph' | 'list' | null;
    const printParam = urlParams.get('print');

    if (nodeParam) {
      selectedNodeId.value = nodeParam;
    }
    if (viewParam && ['graph', 'list'].includes(viewParam)) {
      viewMode.value = viewParam;
    }
    if (printParam === 'true') {
      isPrintMode.value = true;
    }
  });

  if (!roadmap.value) {
    return (
      <div class="container-responsive py-12">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Roadmap Not Found</h1>
          <p class="text-gray-600 mb-6">The requested roadmap could not be found.</p>
          <a href="/roadmaps" class="btn btn-primary">
            ← Back to Roadmaps
          </a>
        </div>
      </div>
    );
  }

  const selectedNode = selectedNodeId.value ? getNodeById(roadmap.value, selectedNodeId.value) : null;

  return (
    <div class="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-white border-b border-gray-200 px-4 py-4">
        <div class="flex items-center justify-between max-w-7xl mx-auto">
          <div class="flex items-center space-x-4">
            <a href="/roadmaps" class="text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">{roadmap.value.meta.title}</h1>
              <p class="text-sm text-gray-500">{roadmap.value.meta.summary}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div class="flex items-center space-x-4">
            {/* View Toggle */}
            <div class="flex bg-gray-100 rounded-lg p-1">
              <button
                class={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode.value === 'graph' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick$={() => viewMode.value = 'graph'}
              >
                Graph
              </button>
              <button
                class={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode.value === 'list' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick$={() => viewMode.value = 'list'}
              >
                List
              </button>
            </div>

            {/* Filter Toggle */}
            <button 
              class={`btn ${showOptional.value ? 'btn-primary' : 'btn-ghost'} text-sm`}
              onClick$={() => showOptional.value = !showOptional.value}
            >
              {showOptional.value ? 'Hide' : 'Show'} Optional
            </button>

            {/* Actions */}
            <button class="btn btn-ghost">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
            <button class="btn btn-ghost">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div class="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Legend */}
        <aside class="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div class="p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Legend</h3>
            
            {/* Status Legend */}
            <div class="space-y-2 mb-6">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span class="text-sm text-gray-700">Core</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span class="text-sm text-gray-700">Optional</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span class="text-sm text-gray-700">Good to Know</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span class="text-sm text-gray-700">Avoid</span>
              </div>
            </div>

            {/* Level Legend */}
            <div class="space-y-2 mb-6">
              <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide">Levels</h4>
              <div class="flex items-center">
                <span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-medium rounded mr-2">B</span>
                <span class="text-sm text-gray-700">Beginner</span>
              </div>
              <div class="flex items-center">
                <span class="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 text-xs font-medium rounded mr-2">I</span>
                <span class="text-sm text-gray-700">Intermediate</span>
              </div>
              <div class="flex items-center">
                <span class="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 text-xs font-medium rounded mr-2">A</span>
                <span class="text-sm text-gray-700">Advanced</span>
              </div>
            </div>

            {/* Level Filters */}
            <div class="space-y-2 mb-6">
              <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide">Show Levels</h4>
              {(['B', 'I', 'A'] as const).map((level) => (
                <label key={level} class="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLevels.value.includes(level)}
                    onChange$={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.checked) {
                        selectedLevels.value = [...selectedLevels.value, level];
                      } else {
                        selectedLevels.value = selectedLevels.value.filter(l => l !== level);
                      }
                    }}
                    class="mr-2 rounded"
                  />
                  <span class="text-sm text-gray-700">
                    {level === 'B' ? 'Beginner' : level === 'I' ? 'Intermediate' : 'Advanced'}
                  </span>
                </label>
              ))}
            </div>

            {/* Progress Summary */}
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Progress</h4>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-700">Completed</span>
                <span class="font-medium">0 / {roadmap.value.nodes.length}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-primary-600 h-2 rounded-full" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main class="flex-1 flex overflow-hidden">
          {/* Graph/List View */}
          <div class="flex-1 relative">
            {viewMode.value === 'graph' ? (
              <div class="absolute inset-0">
                <RoadmapGraph
                  nodes={roadmap.value.nodes}
                  edges={roadmap.value.edges}
                  layout={roadmap.value.layout}
                  selectedNodeId={selectedNodeId.value}
                  onNodeSelect$={(nodeId: string) => {
                    selectedNodeId.value = nodeId;
                    // Update URL without page reload
                    const url = new URL(window.location.href);
                    url.searchParams.set('node', nodeId);
                    window.history.replaceState({}, '', url.toString());
                  }}
                  onToggleProgress$={(nodeId: string) => {
                    // TODO: Implement progress tracking
                    console.log('Toggle progress for:', nodeId);
                  }}
                  filters={{
                    showOptional: showOptional.value,
                    levels: selectedLevels.value,
                  }}
                />
              </div>
            ) : (
              <div class="p-6 overflow-y-auto h-full">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Learning Path</h2>
                <div class="space-y-4">
                  {roadmap.value.nodes
                    .filter(node => {
                      if (!showOptional.value && node.status === 'optional') return false;
                      if (!selectedLevels.value.includes(node.level)) return false;
                      return true;
                    })
                    .map((node, index) => (
                    <div 
                      key={node.id}
                      class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                      onClick$={() => selectedNodeId.value = node.id}
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center mb-2">
                            <span class="text-lg font-medium mr-2">{index + 1}.</span>
                            <h3 class="text-lg font-medium text-gray-900">{node.title}</h3>
                            <span class={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded ${
                              node.level === 'B' ? 'bg-green-100 text-green-800' :
                              node.level === 'I' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {node.level}
                            </span>
                          </div>
                          {node.summary && (
                            <p class="text-gray-600 text-sm mb-2">{node.summary}</p>
                          )}
                          {node.estimatedTime && (
                            <p class="text-xs text-gray-500">Estimated time: {node.estimatedTime}</p>
                          )}
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
              </div>
            )}
          </div>

          {/* Right Sidebar - Details Panel */}
          {selectedNode && (
            <aside class="w-96 bg-white border-l border-gray-200 overflow-y-auto">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <h2 class="text-lg font-semibold text-gray-900">{selectedNode.title}</h2>
                  <button 
                    class="text-gray-400 hover:text-gray-600"
                    onClick$={() => selectedNodeId.value = null}
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tabs */}
                <div class="border-b border-gray-200 mb-6">
                  <nav class="-mb-px flex space-x-8">
                    <button class="py-2 px-1 border-b-2 border-primary-500 font-medium text-sm text-primary-600">
                      Overview
                    </button>
                    <button class="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                      Resources ({selectedNode.resources.length})
                    </button>
                    <button class="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                      Progress
                    </button>
                  </nav>
                </div>

                {/* Overview Tab Content */}
                <div class="space-y-4">
                  {selectedNode.summary && (
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-2">Summary</h3>
                      <p class="text-sm text-gray-600">{selectedNode.summary}</p>
                    </div>
                  )}

                  {selectedNode.description && (
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-2">Description</h3>
                      <p class="text-sm text-gray-600">{selectedNode.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 class="text-sm font-medium text-gray-900 mb-2">Details</h3>
                    <dl class="text-sm">
                      <div class="flex justify-between py-1">
                        <dt class="text-gray-500">Level:</dt>
                        <dd class="text-gray-900">
                          {selectedNode.level === 'B' ? 'Beginner' : 
                           selectedNode.level === 'I' ? 'Intermediate' : 'Advanced'}
                        </dd>
                      </div>
                      <div class="flex justify-between py-1">
                        <dt class="text-gray-500">Status:</dt>
                        <dd class="text-gray-900 capitalize">{selectedNode.status.replace('-', ' ')}</dd>
                      </div>
                      {selectedNode.estimatedTime && (
                        <div class="flex justify-between py-1">
                          <dt class="text-gray-500">Est. Time:</dt>
                          <dd class="text-gray-900">{selectedNode.estimatedTime}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {selectedNode.tags.length > 0 && (
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                      <div class="flex flex-wrap gap-1">
                        {selectedNode.tags.map((tag) => (
                          <span key={tag} class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const roadmap = resolveValue(useRoadmapLoader);
  
  if (!roadmap) {
    return {
      title: "Roadmap Not Found - DevAtlas",
      meta: [
        {
          name: "description",
          content: "The requested roadmap could not be found.",
        },
      ],
    };
  }

  return {
    title: `${roadmap.meta.title} - DevAtlas`,
    meta: [
      {
        name: "description",
        content: roadmap.meta.summary,
      },
      {
        name: "keywords",
        content: roadmap.meta.tags.join(", "),
      },
    ],
  };
};