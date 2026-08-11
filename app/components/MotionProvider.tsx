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

    const revealElements = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const mediaRevealElements = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-work-visual], [data-media-reveal]"),
      );

    // Keep media-bearing reveals hidden until their images have decoded. This
    // lets the browser retain native lazy loading while preventing a card from
    // animating in before its visual content is ready to paint.
    const setupMediaReadiness = () => {
      const mediaTargets = mediaRevealElements();

      if (mediaTargets.length === 0) {
        return () => {};
      }

      const cleanupListeners: Array<() => void> = [];

      mediaTargets.forEach((target) => {
        const images = Array.from(target.querySelectorAll("img"));

        if (images.length === 0) {
          target.classList.add("is-image-ready");
          return;
        }

        let pendingImages = images.length;

        const markTargetReady = () => {
          pendingImages -= 1;

          if (pendingImages === 0) {
            target.classList.add("is-image-ready");
          }
        };

        images.forEach((image) => {
          let settled = false;

          const markImageReady = () => {
            if (settled) return;

            settled = true;
            markTargetReady();
          };

          const decodeImage = () => {
            if (typeof image.decode !== "function") {
              markImageReady();
              return;
            }

            void image.decode().then(markImageReady).catch(markImageReady);
          };

          if (image.complete) {
            decodeImage();
            return;
          }

          image.addEventListener("load", decodeImage, { once: true });
          image.addEventListener("error", markImageReady, { once: true });
          cleanupListeners.push(() => {
            image.removeEventListener("load", decodeImage);
            image.removeEventListener("error", markImageReady);
          });
        });
      });

      return () => {
        cleanupListeners.forEach((cleanup) => cleanup());
        mediaTargets.forEach((target) => target.classList.remove("is-image-ready"));
      };
    };

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
            visual.style.setProperty("--work-scale", (0.97 + focus * 0.03).toFixed(3));
            visual.style.setProperty("--work-blur", `${((1 - focus) * 0.35).toFixed(2)}px`);
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

    const setupHomeHandoff = () => {
      const homeHero = document.querySelector<HTMLElement>("[data-home-hero]");
      const workStage = document.querySelector<HTMLElement>("[data-work-stage]");

      if (!homeHero || !workStage) {
        return () => {};
      }

      // The home route includes a tiny static-script fallback so this
      // particular handoff remains available before React hydrates.
      if (homeHero.dataset.handoffReady === "true") {
        return () => {};
      }

      const handoffQuery = window.matchMedia("(min-width: 951px)");
      let handoffFrame: number | undefined;

      const clearHandoff = () => {
        homeHero.classList.remove("is-handoff");
        homeHero.style.removeProperty("--home-handoff-opacity");
        homeHero.style.removeProperty("--home-handoff-scale");
      };

      const updateHandoff = () => {
        handoffFrame = undefined;

        if (!handoffQuery.matches || window.innerHeight <= 0) {
          clearHandoff();
          return;
        }

        const viewportHeight = window.innerHeight;
        const stageTop = workStage.getBoundingClientRect().top;
        // Tie the hero directly to the leading edge of the work sheet. The
        // broad range keeps the handoff perceptible while avoiding a visible
        // state change as the work stage moves in front of it.
        const start = viewportHeight * 0.7;
        const end = viewportHeight * 0.08;
        const progress = Math.max(0, Math.min(1, (start - stageTop) / (start - end)));
        const easedProgress = 1 - Math.pow(1 - progress, 1.5);

        homeHero.style.setProperty(
          "--home-handoff-opacity",
          (1 - easedProgress * 0.36).toFixed(3),
        );
        homeHero.style.setProperty(
          "--home-handoff-scale",
          (1 - easedProgress * 0.03).toFixed(3),
        );
      };

      const queueHandoff = () => {
        if (handoffFrame !== undefined) return;
        handoffFrame = window.requestAnimationFrame(updateHandoff);
      };

      window.addEventListener("scroll", queueHandoff, { passive: true });
      window.addEventListener("resize", queueHandoff);
      handoffQuery.addEventListener("change", queueHandoff);
      queueHandoff();

      return () => {
        if (handoffFrame !== undefined) window.cancelAnimationFrame(handoffFrame);
        window.removeEventListener("scroll", queueHandoff);
        window.removeEventListener("resize", queueHandoff);
        handoffQuery.removeEventListener("change", queueHandoff);
        clearHandoff();
      };
    };

    const setupPlayHandoff = () => {
      const playHero = document.querySelector<HTMLElement>("[data-play-hero]");
      const playProjects = document.querySelector<HTMLElement>("[data-play-projects]");

      if (!playHero || !playProjects) {
        return () => {};
      }

      const handoffQuery = window.matchMedia("(min-width: 951px)");
      let handoffFrame: number | undefined;

      const clearHandoff = () => {
        playHero.style.removeProperty("--play-handoff-opacity");
        playHero.style.removeProperty("--play-handoff-scale");
      };

      const updateHandoff = () => {
        handoffFrame = undefined;

        if (!handoffQuery.matches || window.innerHeight <= 0) {
          clearHandoff();
          return;
        }

        const viewportHeight = window.innerHeight;
        const stageTop = playProjects.getBoundingClientRect().top;
        const start = viewportHeight * 0.7;
        const end = viewportHeight * 0.08;
        const progress = Math.max(0, Math.min(1, (start - stageTop) / (start - end)));
        const easedProgress = 1 - Math.pow(1 - progress, 1.5);

        playHero.style.setProperty(
          "--play-handoff-opacity",
          (1 - easedProgress * 0.36).toFixed(3),
        );
        playHero.style.setProperty(
          "--play-handoff-scale",
          (1 - easedProgress * 0.03).toFixed(3),
        );
      };

      const queueHandoff = () => {
        if (handoffFrame !== undefined) return;
        handoffFrame = window.requestAnimationFrame(updateHandoff);
      };

      window.addEventListener("scroll", queueHandoff, { passive: true });
      window.addEventListener("resize", queueHandoff);
      handoffQuery.addEventListener("change", queueHandoff);
      queueHandoff();

      return () => {
        if (handoffFrame !== undefined) window.cancelAnimationFrame(handoffFrame);
        window.removeEventListener("scroll", queueHandoff);
        window.removeEventListener("resize", queueHandoff);
        handoffQuery.removeEventListener("change", queueHandoff);
        clearHandoff();
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

    // These two behaviors are scroll-driven rather than reveal-driven, so they
    // should remain available even if a browser does not support
    // IntersectionObserver.
    const cleanupHomeHandoff = setupHomeHandoff();
    const cleanupPlayHandoff = setupPlayHandoff();
    const cleanupMediaReadiness = setupMediaReadiness();
    const cleanupWorkMotion = setupWorkMotion();

    if (!("IntersectionObserver" in window)) {
      // Do not leave lazy media behind a motion-only readiness gate when the
      // browser cannot observe its entry point. The static page remains fully
      // usable, and native image loading can proceed normally.
      root.classList.remove("motion-active");
      revealElements().forEach((element) => element.classList.add("is-visible"));
      return () => {
        window.cancelAnimationFrame(frameId);
        cleanupHomeHandoff();
        cleanupPlayHandoff();
        cleanupMediaReadiness();
        cleanupWorkMotion();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    const visualRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          visualRevealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px 12% 0px",
        threshold: 0.01,
      },
    );

    let observeFrameId: number | undefined;
    const observeRevealElements = () => {
      revealElements().forEach((element) => {
        if (element.matches("[data-work-visual], [data-visual-reveal], [data-media-reveal]")) {
          visualRevealObserver.observe(element);
          return;
        }

        observer.observe(element);
      });
    };

    // Let the hidden reveal state render first. Without that frame boundary,
    // images that intersect during initial load can skip straight to their
    // finished state and look like they pop into the page.
    observeFrameId = window.requestAnimationFrame(() => {
      observeFrameId = window.requestAnimationFrame(observeRevealElements);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (observeFrameId !== undefined) window.cancelAnimationFrame(observeFrameId);
      observer.disconnect();
      visualRevealObserver.disconnect();
      cleanupHomeHandoff();
      cleanupPlayHandoff();
      cleanupMediaReadiness();
      cleanupWorkMotion();
    };
  }, [pathname]);

  // Rendering a tiny, hidden marker ensures this client boundary is hydrated.
  // The provider otherwise renders no DOM, which can leave motion effects
  // unmounted in streamed/static page output.
  return <span aria-hidden="true" data-motion-provider hidden />;
}
