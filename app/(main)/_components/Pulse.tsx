'use client';

import { useLayoutEffect, useRef } from 'react';

const keyframes = `
  @keyframes pulse {
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

const DURATION = 1_000;

export function Pulse() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const offset = Date.now() % DURATION;

    el.getAnimations()[0].currentTime = offset;
  }, []);

  return (
    <>
      <style>{keyframes}</style>
      <div
        ref={ref}
        className="size-3 bg-gray-900 rounded-full"
        style={{
          animation: `pulse ${DURATION}ms infinite`,
        }}
      />
    </>
  );
}
