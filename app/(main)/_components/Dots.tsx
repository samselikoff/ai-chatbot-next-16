'use client';

import { useLayoutEffect, useRef } from 'react';

const keyframes = `
  @keyframes dots {
    0%,
    100% {
      opacity: 50%;
      scale: 80%;
    }
    50% {
      opacity: 100%;
      scale: 100%;
    }
  }
`;

const DURATION = 1_250;

export function Dots() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el1 = ref1.current;
    const el2 = ref2.current;
    const el3 = ref3.current;
    if (!el1 || !el2 || !el3) return;

    const offset = Date.now() % DURATION;

    el1.getAnimations()[0].currentTime = offset;
    el2.getAnimations()[0].currentTime = offset - DURATION * (1 / 8);
    el3.getAnimations()[0].currentTime = offset - DURATION * (2 / 8);
  }, []);

  return (
    <>
      <style>{keyframes}</style>
      <div className="inline-flex gap-0.5">
        <div
          ref={ref1}
          className="size-[5px] bg-gray-500 rounded-full"
          style={{
            animation: `dots ${DURATION}ms infinite`,
          }}
        />
        <div
          ref={ref2}
          className="size-[5px] bg-gray-500 rounded-full"
          style={{
            animation: `dots ${DURATION}ms infinite`,
          }}
        />
        <div
          ref={ref3}
          className="size-[5px] bg-gray-500 rounded-full"
          style={{
            animation: `dots ${DURATION}ms infinite`,
          }}
        />
      </div>
    </>
  );
}
