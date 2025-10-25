import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { Manifest } from "../../utils/content";
import { loadManifest, getRoadmapsByType } from "../../utils/content";

export const useManifestLoader = routeLoader$<Manifest | null>(() => {
  return loadManifest();
});

export default component$(() => {
  const manifest = useManifestLoader();

  if (!manifest.value) {
    return (
      <div class="container-responsive py-12">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Roadmaps Not Available</h1>
          <p class="text-gray-600">Unable to load roadmaps. Please try again later.</p>
        </div>
      </div>
    );
  }

  const roleRoadmaps = getRoadmapsByType(manifest.value, 'role');
  const skillRoadmaps = getRoadmapsByType(manifest.value, 'skill');

  return (
    <div class="container-responsive py-8">
      {/* Header */}
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Developer Roadmaps
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Interactive roadmaps to guide your learning journey. Choose your path and track your progress.
        </p>
      </div>

      {/* Search Bar */}
      <div class="mb-8 max-w-2xl mx-auto">
        <div class="relative">
          <input
            type="text"
            placeholder="Search roadmaps..."
            class="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div class="mb-8">
        <nav class="flex space-x-8 justify-center" aria-label="Tabs">
          <button
            class="px-3 py-2 font-medium text-sm rounded-md bg-primary-100 text-primary-700"
            aria-current="page"
          >
            All Roadmaps ({manifest.value.roadmaps.length})
          </button>
          <button class="px-3 py-2 font-medium text-sm text-gray-500 hover:text-gray-700">
            Role-Based ({roleRoadmaps.length})
          </button>
          <button class="px-3 py-2 font-medium text-sm text-gray-500 hover:text-gray-700">
            Skill-Based ({skillRoadmaps.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div class="mb-8 flex flex-wrap justify-center gap-2">
        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
          All Levels
        </button>
        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
          Beginner
        </button>
        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
          Intermediate
        </button>
        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
          Advanced
        </button>
      </div>

      {/* Roadmaps Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manifest.value.roadmaps.map((roadmap) => (
          <a
            key={roadmap.id}
            href={`/roadmaps/${roadmap.slug}`}
            class="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <span
                  class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    roadmap.type === 'role'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {roadmap.type}
                </span>
                <span
                  class={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    roadmap.level === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : roadmap.level === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : roadmap.level === 'advanced'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {roadmap.level}
                </span>
              </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2">
              {roadmap.title}
            </h3>
            
            <p class="text-gray-600 text-sm mb-4">
              {roadmap.summary}
            </p>
            
            {roadmap.tags.length > 0 && (
              <div class="flex flex-wrap gap-1">
                {roadmap.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
                {roadmap.tags.length > 3 && (
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                    +{roadmap.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </a>
        ))}
      </div>

      {manifest.value.roadmaps.length === 0 && (
        <div class="text-center py-12">
          <p class="text-gray-500">No roadmaps found.</p>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Developer Roadmaps - DevAtlas",
  meta: [
    {
      name: "description",
      content: "Interactive roadmaps to guide your learning journey. Choose your path and track your progress in frontend, backend, DevOps, and more.",
    },
    {
      name: "keywords", 
      content: "developer roadmaps, learning path, web development, programming, frontend, backend, devops",
    },
  ],
};