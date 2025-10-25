import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      {/* Hero Section */}
      <div class="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div class="container-responsive py-16 text-center">
          <h1 class="text-5xl font-bold mb-6">
            DevAtlas
          </h1>
          <p class="text-xl mb-8 max-w-3xl mx-auto text-primary-100">
            Interactive roadmaps to guide your learning journey. Master frontend, backend, DevOps, and more with our curated paths and progress tracking.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/roadmaps" class="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              Explore Roadmaps
            </a>
            <button class="btn bg-primary-700 hover:bg-primary-600 border border-primary-500 px-8 py-3 text-lg font-medium">
              Generate My Path
            </button>
          </div>
        </div>
      </div>

      {/* Quick Preview */}
      <div class="container-responsive py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Start Your Journey</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our curated roadmaps or get AI-powered recommendations based on your goals and experience.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a href="/roadmaps/frontend-developer" class="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600">Frontend Developer</h3>
                <p class="text-sm text-gray-500">HTML, CSS, JavaScript, React & more</p>
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span>5 topics</span>
              <span class="mx-2">•</span>
              <span>6 months</span>
              <span class="mx-2">•</span>
              <span class="text-green-600">Beginner friendly</span>
            </div>
          </a>

          <div class="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600">Backend Developer</h3>
                <p class="text-sm text-gray-500">APIs, databases, cloud services</p>
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span>Coming soon</span>
            </div>
          </div>

          <div class="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow opacity-75">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600">DevOps Engineer</h3>
                <p class="text-sm text-gray-500">CI/CD, containers, infrastructure</p>
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span>Coming soon</span>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <a href="/roadmaps" class="btn btn-primary px-8 py-3 text-lg">
            View All Roadmaps
          </a>
        </div>
      </div>

      {/* Features */}
      <div class="bg-gray-50 py-16">
        <div class="container-responsive">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Why DevAtlas?</h2>
            <p class="text-lg text-gray-600">Built for developers, by developers</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Interactive Learning</h3>
              <p class="text-gray-600">Visual roadmaps with progress tracking and interactive elements to guide your learning journey.</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">AI-Powered Recommendations</h3>
              <p class="text-gray-600">Get personalized learning paths based on your goals, experience, and available time.</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p class="text-gray-600">Curated by experts and the developer community with up-to-date resources and best practices.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "DevAtlas - Interactive Developer Roadmaps",
  meta: [
    {
      name: "description",
      content: "Interactive roadmaps to guide your learning journey. Master frontend, backend, DevOps, and more with our curated paths and progress tracking.",
    },
    {
      name: "keywords", 
      content: "developer roadmaps, learning path, web development, programming, frontend, backend, devops, career guidance",
    },
  ],
};
