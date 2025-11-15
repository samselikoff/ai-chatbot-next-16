import { ReactNode, use } from 'react';

export function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (value: T) => ReactNode;
}) {
  const value = use(promise);

  return children(value);
}
