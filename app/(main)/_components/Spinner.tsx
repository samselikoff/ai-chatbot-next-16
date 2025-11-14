import { ReactNode, useLayoutEffect, useRef } from 'react';

const keyframes = `
  @keyframes spinner {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

export default function Spinner({
  loading = true,
  children,
  className,
}: {
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  if (!loading) return children;

  const spinner = (
    <span className={`relative inline-flex ${className ?? 'size-4'}`}>
      <style>{keyframes}</style>
      {Array.from(Array(8).keys()).map((i) => (
        <Segment index={i} key={i} />
      ))}
    </span>
  );

  if (!children) return spinner;

  return (
    <span className="relative flex items-center justify-center">
      <span className="invisible">{children}</span>

      <span className="absolute inset-0 flex items-center justify-center">
        {spinner}
      </span>
    </span>
  );
}

const DURATION = 800;

function Segment({ index }: { index: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const offset = Date.now() % DURATION;

    el.getAnimations()[0].currentTime = offset;
  }, [index]);

  return (
    <span
      ref={ref}
      className="absolute top-0 left-[calc(50%-12.5%/2)] h-full w-[12.5%] before:block before:h-[30%] before:w-full before:rounded-full before:bg-current"
      style={{
        transform: `rotate(${45 * index}deg)`,
        animation: `spinner ${DURATION}ms linear infinite`,
        animationDelay: `calc(-${8 - index} / 8 * ${DURATION}ms)`,
      }}
    />
  );
}
