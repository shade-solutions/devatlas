import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";

import Header from "../components/starter/header/header";
import Footer from "../components/starter/footer/footer";
import { ThemeToggle } from "../components/theme-toggle";

import styles from "./styles.css?inline";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  useStyles$(styles);
  const location = useLocation();
  
  // Check if we're on a roadmap detail page (which needs full height layout)
  const isRoadmapDetail = location.url.pathname.startsWith('/roadmaps/') && 
                          location.url.pathname.split('/').length > 3;
  
  return (
    <>
      {/* Theme Toggle - Fixed Position */}
      <div class="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {!isRoadmapDetail && <Header />}
      <main class={isRoadmapDetail ? 'h-screen' : ''}>
        <Slot />
      </main>
      {!isRoadmapDetail && <Footer />}
    </>
  );
});
