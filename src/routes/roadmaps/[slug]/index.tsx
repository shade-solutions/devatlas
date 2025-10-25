import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { loadRoadmap, getNodeById, type CompiledRoadmap } from "../../../utils/content";
import RoadmapGraph from "../../../components/roadmap/Graph";

export const useRoadmapLoader = routeLoader$<CompiledRoadmap | null>(({ params }) => {
  return loadRoadmap(params.slug);
});

export default component$(() => {
  const roadmap = useRoadmapLoader();
  const selectedNodeId = useSignal<string | null>(null);
  const viewMode = useSignal<'graph' | 'list'>('graph');
  const showOptional = useSignal(true);
  const selectedLevels = useSignal<('B' | 'I' | 'A')[]>(['B', 'I', 'A']);
  const sidebarOpen = useSignal(true);

  if (!roadmap.value) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-background">
        <div class="text-center px-4">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold gradient-text mb-3">Roadmap Not Found</h1>
          <p class="text-muted-foreground mb-8 max-w-md mx-auto">The roadmap you're looking for doesn't exist or has been moved.</p>
          <a href="/roadmaps" class="btn btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Roadmaps
          </a>
        </div>
      </div>
    );
  }

  const selectedNode = selectedNodeId.value ? getNodeById(roadmap.value, selectedNodeId.value) : null;

  return (
    <div class="flex flex-col h-screen bg-background">
      {/* Modern Header with Glass Effect */}
      <header class="glass border-b border-border shadow-lg">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-4">
            <a 
              href="/roadmaps" 
              class="flex items-center justify-center w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 shadow-sm hover:shadow transition-all duration-200"
            >
              <svg class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 class="text-2xl font-bold gradient-text">{roadmap.value.meta.title}</h1>
              <p class="text-sm text-muted-foreground mt-0.5">{roadmap.value.meta.summary}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div class="flex items-center gap-3">
            {/* View Toggle */}
            <div class="flex bg-muted rounded-xl p-1 shadow-sm">
              <button
                class={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  viewMode.value === 'graph' 
                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick$={() => viewMode.value = 'graph'}
              >
                <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Graph
              </button>
              <button
                class={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  viewMode.value === 'list' 
                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick$={() => viewMode.value = 'list'}
              >
                <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                List
              </button>
            </div>

            {/* Filter Toggle */}
            <button 
              class={`btn ${showOptional.value ? 'btn-primary' : 'btn-outline'}`}
              onClick$={() => showOptional.value = !showOptional.value}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showOptional.value ? 'Hide' : 'Show'} Optional
            </button>

            {/* Sidebar Toggle */}
            <button 
              class="btn btn-ghost"
              onClick$={() => sidebarOpen.value = !sidebarOpen.value}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div class="px-6 pb-3">
          <div class="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span class="font-medium">Your Progress</span>
            <span class="font-semibold">0 / {roadmap.value.nodes.length} completed</span>
          </div>
          <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500" style="width: 0%"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div class="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Legend */}
        {sidebarOpen.value && (
          <aside class="w-72 glass border-r border-border overflow-y-auto">
            <div class="p-6 space-y-6">
              {/* Status Legend */}
              <div>
                <h3 class="text-sm font-bold text-foreground mb-4 flex items-center">
                  <span class="w-1 h-4 bg-gradient-to-b from-indigo-600 to-purple-600 rounded mr-2"></span>
                  Node Status
                </h3>
                <div class="space-y-3">
                  {[
                    { label: 'Core', color: 'bg-indigo-500', desc: 'Essential to learn' },
                    { label: 'Optional', color: 'bg-emerald-500', desc: 'Nice to know' },
                    { label: 'Good to Know', color: 'bg-amber-500', desc: 'Helpful knowledge' },
                    { label: 'Avoid', color: 'bg-red-500', desc: 'Not recommended' }
                  ].map((item) => (
                    <div key={item.label} class="flex items-start gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors">
                      <div class={`w-4 h-4 ${item.color} rounded-md shadow-sm mt-0.5`}></div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-foreground">{item.label}</div>
                        <div class="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level Legend */}
              <div>
                <h3 class="text-sm font-bold text-foreground mb-4 flex items-center">
                  <span class="w-1 h-4 bg-gradient-to-b from-indigo-600 to-purple-600 rounded mr-2"></span>
                  Difficulty Levels
                </h3>
                <div class="space-y-3">
                  {[
                    { level: 'B', label: 'Beginner', color: 'from-emerald-400 to-emerald-600', desc: 'Start here' },
                    { level: 'I', label: 'Intermediate', color: 'from-amber-400 to-amber-600', desc: 'Some experience' },
                    { level: 'A', label: 'Advanced', color: 'from-red-400 to-red-600', desc: 'Expert level' }
                  ].map((item) => (
                    <label key={item.level} class="flex items-start gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLevels.value.includes(item.level as 'B' | 'I' | 'A')}
                        onChange$={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.checked) {
                            selectedLevels.value = [...selectedLevels.value, item.level as 'B' | 'I' | 'A'];
                          } else {
                            selectedLevels.value = selectedLevels.value.filter(l => l !== item.level);
                          }
                        }}
                        class="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span class={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${item.color} text-white text-xs font-bold shadow-sm`}>
                            {item.level}
                          </span>
                          <span class="text-sm font-medium text-foreground">{item.label}</span>
                        </div>
                        <div class="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div class="card p-4">
                <h3 class="text-sm font-bold text-foreground mb-3">Roadmap Stats</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Total Topics:</span>
                    <span class="font-semibold text-foreground">{roadmap.value.nodes.length}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Core Topics:</span>
                    <span class="font-semibold text-indigo-600">
                      {roadmap.value.nodes.filter(n => n.status === 'core').length}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Optional:</span>
                    <span class="font-semibold text-emerald-600">
                      {roadmap.value.nodes.filter(n => n.status === 'optional').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main class="flex-1 flex overflow-hidden relative">
          {/* Graph/List View */}
          <div class="flex-1 relative">
            {viewMode.value === 'graph' ? (
              <div class="absolute inset-0 rounded-2xl overflow-hidden m-4 shadow-xl">
                <RoadmapGraph
                  nodes={roadmap.value.nodes}
                  edges={roadmap.value.edges}
                  layout={roadmap.value.layout}
                  selectedNodeId={selectedNodeId.value ?? undefined}
                  filters={{
                    showOptional: showOptional.value,
                    levels: selectedLevels.value,
                  }}
                />
              </div>
            ) : (
              <div class="p-6 overflow-y-auto h-full">
                <div class="max-w-4xl mx-auto space-y-4">
                  <h2 class="text-2xl font-bold gradient-text mb-6">Learning Path</h2>
                  {roadmap.value.nodes
                    .filter(node => {
                      if (!showOptional.value && node.status === 'optional') return false;
                      if (!selectedLevels.value.includes(node.level)) return false;
                      return true;
                    })
                    .map((node, index) => (
                    <div 
                      key={node.id}
                      class="card p-5 cursor-pointer group"
                      onClick$={() => selectedNodeId.value = node.id}
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-3 mb-2">
                            <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 text-sm font-bold">
                              {index + 1}
                            </span>
                            <h3 class="text-lg font-semibold text-foreground group-hover:text-indigo-600 transition-colors">
                              {node.title}
                            </h3>
                            <span class={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                              node.level === 'B' ? 'bg-emerald-100 text-emerald-700' :
                              node.level === 'I' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {node.level === 'B' ? 'Beginner' : node.level === 'I' ? 'Intermediate' : 'Advanced'}
                            </span>
                          </div>
                          {node.summary && (
                            <p class="text-muted-foreground text-sm leading-relaxed mb-2">{node.summary}</p>
                          )}
                          <div class="flex items-center gap-4 text-xs text-muted-foreground">
                            {node.estimatedTime && (
                              <span class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {node.estimatedTime}
                              </span>
                            )}
                            <span class="flex items-center gap-1">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              {node.resources.length} resources
                            </span>
                          </div>
                        </div>
                        <div class={`w-3 h-3 rounded-full shadow-sm ${
                          node.status === 'core' ? 'bg-indigo-500' :
                          node.status === 'optional' ? 'bg-emerald-500' :
                          node.status === 'good-to-know' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Details Panel */}
          {selectedNode && (
            <aside class="w-96 glass border-l border-border overflow-y-auto shadow-xl">
              <div class="p-6">
                <div class="flex items-start justify-between mb-6">
                  <h2 class="text-xl font-bold gradient-text pr-4">{selectedNode.title}</h2>
                  <button 
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground transition-all"
                    onClick$={() => selectedNodeId.value = null}
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Node Metadata */}
                <div class="flex gap-2 mb-6">
                  <span class={`badge ${
                    selectedNode.level === 'B' ? 'badge-success' :
                    selectedNode.level === 'I' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {selectedNode.level === 'B' ? 'Beginner' : selectedNode.level === 'I' ? 'Intermediate' : 'Advanced'}
                  </span>
                  <span class="badge badge-primary capitalize">
                    {selectedNode.status.replace('-', ' ')}
                  </span>
                </div>

                {/* Content */}
                <div class="space-y-6">
                  {selectedNode.summary && (
                    <div>
                      <h3 class="text-sm font-bold text-foreground mb-2 flex items-center">
                        <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Summary
                      </h3>
                      <p class="text-sm text-foreground leading-relaxed">{selectedNode.summary}</p>
                    </div>
                  )}

                  {selectedNode.description && (
                    <div>
                      <h3 class="text-sm font-bold text-foreground mb-2 flex items-center">
                        <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Description
                      </h3>
                      <p class="text-sm text-foreground leading-relaxed">{selectedNode.description}</p>
                    </div>
                  )}

                  {selectedNode.estimatedTime && (
                    <div class="card p-4">
                      <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs text-muted-foreground">Estimated Time</div>
                          <div class="text-sm font-semibold text-foreground">{selectedNode.estimatedTime}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode.tags.length > 0 && (
                    <div>
                      <h3 class="text-sm font-bold text-foreground mb-3">Tags</h3>
                      <div class="flex flex-wrap gap-2">
                        {selectedNode.tags.map((tag) => (
                          <span key={tag} class="badge badge-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNode.resources.length > 0 && (
                    <div>
                      <h3 class="text-sm font-bold text-foreground mb-3 flex items-center">
                        <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Resources ({selectedNode.resources.length})
                      </h3>
                      <div class="text-sm text-muted-foreground">
                        Resources will be displayed here
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
