import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="min-h-screen">
      {/* Hero Section with Animated Gradient */}
      <div class="relative overflow-hidden bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLTItNC00LTRzLTQgMi00IDQgMiA0IDQgNCA0LTIgNC00em0wLTMwdjRjMC0yLTItNC00LTRzLTQgMi00IDQgMiA0IDQgNCA0LTIgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div class="container-responsive relative py-24 md:py-32 text-center">
          <div class="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <span class="relative flex h-2 w-2 mr-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span class="text-sm font-medium">Now with AI-Powered Recommendations</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
            Your Developer<br />
            <span class="bg-linear-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Journey Starts Here
            </span>
          </h1>
          
          <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90 leading-relaxed">
            Interactive roadmaps to master web development. Track your progress, discover resources, and level up your skills with guided learning paths.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/roadmaps" class="btn btn-primary bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Explore Roadmaps
            </a>
            <button class="btn glass text-white border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-semibold">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Generate My Path
            </button>
          </div>

          {/* Stats */}
          <div class="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { label: 'Roadmaps', value: '1+' },
              { label: 'Topics', value: '100+' },
              { label: 'Resources', value: '500+' }
            ].map((stat) => (
              <div key={stat.label} class="glass p-4 rounded-2xl backdrop-blur-md">
                <div class="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div class="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave separator */}
        <div class="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="w-full h-16 md:h-24">
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Featured Roadmaps */}
      <div class="container-responsive py-20">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold gradient-text mb-4">Choose Your Path</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Structured learning paths designed by industry experts to take you from beginner to professional.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Frontend Developer - Active */}
          <a href="/roadmaps/frontend-developer" class="card group p-8 cursor-pointer relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <div class="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="badge badge-success">Active</span>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                Frontend Developer
              </h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Step by step guide to becoming a modern frontend developer
              </p>

              <div class="space-y-3 mb-6">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  HTML, CSS, JavaScript, React & more
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  6 months estimated
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Beginner friendly
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-sm text-gray-500">5 topics covered</span>
                <svg class="w-5 h-5 text-indigo-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </a>

          {/* Backend Developer - Coming Soon */}
          <div class="card p-8 relative overflow-hidden opacity-75">
            <div class="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-100 to-emerald-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <div class="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <span class="badge badge-warning">Coming Soon</span>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-3">Backend Developer</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Master server-side development, APIs, and databases
              </p>

              <div class="space-y-3 mb-6">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Node.js, Python, Databases, Cloud
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  8 months estimated
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Intermediate level
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-sm text-gray-500">Coming soon</span>
              </div>
            </div>
          </div>

          {/* DevOps Engineer - Coming Soon */}
          <div class="card p-8 relative overflow-hidden opacity-75">
            <div class="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <div class="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span class="badge badge-warning">Coming Soon</span>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-3">DevOps Engineer</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Learn CI/CD, containers, and infrastructure automation
              </p>

              <div class="space-y-3 mb-6">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Docker, Kubernetes, AWS, Terraform
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  10 months estimated
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Advanced level
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-sm text-gray-500">Coming soon</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <a href="/roadmaps" class="btn btn-primary px-8 py-3 text-lg">
            View All Roadmaps
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div class="bg-linear-to-br from-gray-50 to-white py-20 border-y border-gray-200">
        <div class="container-responsive">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold gradient-text mb-4">Why DevAtlas?</h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to master your learning journey in one place.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                ),
                title: 'Interactive Roadmaps',
                description: 'Visual, interactive learning paths that guide you step-by-step through your journey.',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                ),
                title: 'Track Progress',
                description: 'Monitor your learning progress and celebrate milestones as you advance.',
                color: 'from-green-500 to-emerald-600'
              },
              {
                icon: (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                ),
                title: 'Curated Resources',
                description: 'Access carefully selected learning materials and tutorials for each topic.',
                color: 'from-purple-500 to-pink-600'
              },
              {
                icon: (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                ),
                title: 'AI Recommendations',
                description: 'Get personalized learning path suggestions based on your goals and experience.',
                color: 'from-amber-500 to-orange-600'
              },
              {
                icon: (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                ),
                title: 'Community Driven',
                description: 'Learn from roadmaps created and reviewed by industry professionals.',
                color: 'from-pink-500 to-rose-600'
              },
              {
                icon: (
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: 'Always Updated',
                description: 'Stay current with the latest technologies and industry best practices.',
                color: 'from-cyan-500 to-blue-600'
              }
            ].map((feature, index) => (
              <div key={index} class="card p-6 group hover:shadow-xl transition-all duration-300">
                <div class={`w-12 h-12 bg-linear-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p class="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div class="container-responsive py-20">
        <div class="card p-12 text-center bg-linear-to-br from-indigo-600 to-purple-600 border-none relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi0yLTQtNC00cy00IDItNCA0IDIgNCA0IDQgNC0yIDQtNHptMC0zMHY0YzAtMi0yLTQtNC00cy00IDItNCA0IDIgNCA0IDQgNC0yIDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
          
          <div class="relative z-10">
            <h2 class="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers learning and growing with DevAtlas.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/roadmaps" class="btn btn-primary bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-2xl">
                Get Started Free
              </a>
              <a href="#" class="btn glass text-white border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "DevAtlas - Interactive Developer Roadmaps & Learning Paths",
  meta: [
    {
      name: "description",
      content: "Master web development with interactive roadmaps, curated resources, and AI-powered recommendations. Track your progress and level up your skills.",
    },
    {
      name: "keywords",
      content: "developer roadmap, learning path, frontend, backend, devops, web development, programming tutorial",
    },
  ],
};
