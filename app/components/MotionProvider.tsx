"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Enables progressive, opt-in motion while keeping the static experience
 * immediately usable for visitors who prefer reduced motion.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let handoffObserver: IntersectionObserver | undefined;
    let playHandoffObserver: IntersectionObserver | undefined;

    const revealElements = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const setupWorkMotion = () => {
      const workVisuals = Array.from(document.querySelectorAll<HTMLElement>("[data-work-visual]"));

      if (workVisuals.length === 0) {
        return () => {};
      }

      const scrollMotionQuery = window.matchMedia(
        "(min-width: 721px) and (hover: hover) and (pointer: fine)",
      );
      let workMotionFrame: number | undefined;

      const clearVisualMotion = () => {
        workVisuals.forEach((visual) => {
          visual.classList.remove("is-scroll-linked");
          visual.style.removeProperty("--work-scale");
          visual.style.removeProperty("--work-blur");
        });
      };

      const updateWorkMotion = () => {
        workMotionFrame = undefined;
        const viewportHeight = window.innerHeight;

        if (viewportHeight <= 0) return;

        if (scrollMotionQuery.matches) {
          const viewportFocus = viewportHeight * 0.5;

          workVisuals.forEach((visual) => {
            const rect = visual.getBoundingClientRect();
            const visualCenter = rect.top + rect.height * 0.5;
            const travel = Math.max(viewportHeight * 0.78, rect.height * 0.84);
            const focus = Math.max(0, Math.min(1, 1 - Math.abs(visualCenter - viewportFocus) / travel));

            visual.classList.add("is-scroll-linked");
            visual.style.setProperty("--work-scale", (0.94 + focus * 0.06).toFixed(3));
            visual.style.setProperty("--work-blur", `${((1 - focus) * 0.65).toFixed(2)}px`);
          });
        } else {
          clearVisualMotion();
        }
      };

      const queueWorkMotion = () => {
        if (workMotionFrame !== undefined) return;
        workMotionFrame = window.requestAnimationFrame(updateWorkMotion);
      };

      window.addEventListener("scroll", queueWorkMotion, { passive: true });
      window.addEventListener("resize", queueWorkMotion);
      scrollMotionQuery.addEventListener("change", queueWorkMotion);
      queueWorkMotion();

      return () => {
        if (workMotionFrame !== undefined) window.cancelAnimationFrame(workMotionFrame);
        window.removeEventListener("scroll", queueWorkMotion);
        window.removeEventListener("resize", queueWorkMotion);
        scrollMotionQuery.removeEventListener("change", queueWorkMotion);
        clearVisualMotion();
      };
    };

    const setupPlayMotion = () => {
      const playVisuals = Array.from(document.querySelectorAll<HTMLElement>("[data-play-visual]"));

      if (playVisuals.length === 0) {
        return () => {};
      }

      const scrollMotionQuery = window.matchMedia(
        "(min-width: 721px) and (hover: hover) and (pointer: fine)",
      );
      let playMotionFrame: number | undefined;

      const clearVisualMotion = () => {
        playVisuals.forEach((visual) => {
          visual.classList.remove("is-scroll-linked");
          visual.style.removeProperty("--play-scale");
          visual.style.removeProperty("--play-blur");
        });
      };

      const updatePlayMotion = () => {
        playMotionFrame = undefined;

        if (!scrollMotionQuery.matches || window.innerHeight <= 0) {
          clearVisualMotion();
          return;
        }

        const viewportHeight = window.innerHeight;
        const viewportFocus = viewportHeight * 0.5;

        playVisuals.forEach((visual) => {
          const rect = visual.getBoundingClientRect();
          const visualCenter = rect.top + rect.height * 0.5;
          const travel = Math.max(viewportHeight * 0.82, rect.height * 0.9);
          const focus = Math.max(0, Math.min(1, 1 - Math.abs(visualCenter - viewportFocus) / travel));

          visual.classList.add("is-scroll-linked");
          visual.style.setProperty("--play-scale", (0.955 + focus * 0.045).toFixed(3));
          visual.style.setProperty("--play-blur", `${((1 - focus) * 0.45).toFixed(2)}px`);
        });
      };

      const queuePlayMotion = () => {
        if (playMotionFrame !== undefined) return;
        playMotionFrame = window.requestAnimationFrame(updatePlayMotion);
      };

      window.addEventListener("scroll", queuePlayMotion, { passive: true });
      window.addEventListener("resize", queuePlayMotion);
      scrollMotionQuery.addEventListener("change", queuePlayMotion);
      queuePlayMotion();

      return () => {
        if (playMotionFrame !== undefined) window.cancelAnimationFrame(playMotionFrame);
        window.removeEventListener("scroll", queuePlayMotion);
        window.removeEventListener("resize", queuePlayMotion);
        scrollMotionQuery.removeEventListener("change", queuePlayMotion);
        clearVisualMotion();
      };
    };

    if (prefersReducedMotion.matches) {
      revealElements().forEach((element) => element.classList.add("is-visible"));
      return;
    }

    root.classList.add("motion-active");
    const frameId = window.requestAnimationFrame(() => {
      root.classList.add("motion-loaded");
    });

    if (!("IntersectionObserver" in window)) {
      revealElements().forEach((element) => element.classList.add("is-visible"));
      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    revealElements().forEach((element) => observer?.observe(element));

    const homeHero = document.querySelector<HTMLElement>("[data-home-hero]");
    const workIntro = document.querySelector<HTMLElement>("[data-work-intro]");

    if (homeHero && workIntro) {
      handoffObserver = new IntersectionObserver(
        ([entry]) => {
          homeHero.classList.toggle("is-handoff", entry.isIntersecting);
        },
        {
          rootMargin: "0px 0px -34% 0px",
          threshold: 0.01,
        },
      );

      handoffObserver.observe(workIntro);
    }

    const playHero = document.querySelector<HTMLElement>("[data-play-hero]");
    const playProjects = document.querySelector<HTMLElement>("[data-play-projects]");

    if (playHero && playProjects) {
      playHandoffObserver = new IntersectionObserver(
        ([entry]) => {
          playHero.classList.toggle("is-handoff", entry.isIntersecting);
        },
        {
          rootMargin: "0px 0px -34% 0px",
          threshold: 0.01,
        },
      );

      playHandoffObserver.observe(playProjects);
    }

    const cleanupWorkMotion = setupWorkMotion();
    const cleanupPlayMotion = setupPlayMotion();

    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      handoffObserver?.disconnect();
      playHandoffObserver?.disconnect();
      cleanupWorkMotion();
      cleanupPlayMotion();
      homeHero?.classList.remove("is-handoff");
      playHero?.classList.remove("is-handoff");
    };
  }, [pathname]);

  return null;
}
