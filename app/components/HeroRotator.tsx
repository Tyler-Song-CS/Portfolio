"use client";

import { useEffect, useState } from "react";

const FIRST_TRANSITION_DELAY = 1650;
const TRANSITION_INTERVAL = 3200;
const TRANSITION_DURATION = 640;
const WORD_COUNT = 5;

/**
 * Cycles the hero verb after its initial static introduction. The duplicated
 * final word lets the track return to the first word without a visible jump.
 */
export function HeroRotator() {
  const [wordIndex, setWordIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentIndex = 0;
    let transitionTimer: number | undefined;
    let resetTimer: number | undefined;
    let firstAnimationFrame: number | undefined;
    let secondAnimationFrame: number | undefined;
    let disposed = false;

    const clearScheduledWork = () => {
      if (transitionTimer !== undefined) {
        window.clearTimeout(transitionTimer);
        transitionTimer = undefined;
      }

      if (resetTimer !== undefined) {
        window.clearTimeout(resetTimer);
        resetTimer = undefined;
      }

      if (firstAnimationFrame !== undefined) {
        window.cancelAnimationFrame(firstAnimationFrame);
        firstAnimationFrame = undefined;
      }

      if (secondAnimationFrame !== undefined) {
        window.cancelAnimationFrame(secondAnimationFrame);
        secondAnimationFrame = undefined;
      }
    };

    const enableTransitionOnNextPaint = (afterReset = false) => {
      firstAnimationFrame = window.requestAnimationFrame(() => {
        firstAnimationFrame = undefined;

        if (disposed || reducedMotionQuery.matches) return;

        // After snapping duplicate "ships." back to the first item, wait a
        // complete paint before restoring the transform transition.
        if (afterReset) {
          secondAnimationFrame = window.requestAnimationFrame(() => {
            secondAnimationFrame = undefined;

            if (!disposed && !reducedMotionQuery.matches) {
              setTransitionEnabled(true);
            }
          });
          return;
        }

        setTransitionEnabled(true);
      });
    };

    const scheduleNextStep = () => {
      transitionTimer = window.setTimeout(advanceWord, TRANSITION_INTERVAL);
    };

    const resetToFirstWord = () => {
      resetTimer = undefined;

      if (disposed || reducedMotionQuery.matches) return;

      // Both endpoints read "ships.", so this snap is visually seamless.
      currentIndex = 0;
      setTransitionEnabled(false);
      setWordIndex(0);
      enableTransitionOnNextPaint(true);
    };

    const advanceWord = () => {
      transitionTimer = undefined;

      if (disposed || reducedMotionQuery.matches) return;

      currentIndex += 1;
      setTransitionEnabled(true);
      setWordIndex(currentIndex);

      if (currentIndex === WORD_COUNT - 1) {
        // Reset as soon as the duplicate final word settles so the next
        // visible transition still begins on the regular 3.2 second cadence.
        resetTimer = window.setTimeout(resetToFirstWord, TRANSITION_DURATION);
      }

      scheduleNextStep();
    };

    const startCycle = () => {
      clearScheduledWork();
      currentIndex = 0;
      setTransitionEnabled(false);
      setWordIndex(0);

      if (reducedMotionQuery.matches) return;

      enableTransitionOnNextPaint();
      transitionTimer = window.setTimeout(advanceWord, FIRST_TRANSITION_DELAY);
    };

    const handleMotionPreferenceChange = () => {
      startCycle();
    };

    startCycle();
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      disposed = true;
      clearScheduledWork();
      reducedMotionQuery.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  return (
    <span
      className="editorial-title__rotator-track"
      style={{
        animation: "none",
        transform: `translate3d(0, -${wordIndex * 20}%, 0)`,
        transition: transitionEnabled ? "transform 640ms var(--motion-ease)" : "none",
      }}
    >
      <span>ships.</span>
      <span>designs.</span>
      <span>builds.</span>
      <span>solves.</span>
      <span>ships.</span>
    </span>
  );
}
