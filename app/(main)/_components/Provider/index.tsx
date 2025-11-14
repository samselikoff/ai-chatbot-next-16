'use client';

import { StreamableValue } from '@ai-sdk/rsc';
import { createContext, ReactNode, use } from 'react';

const Context = createContext<{
  cache: Map<string, Promise<StreamableValue<string, unknown>>>;
}>({
  cache: new Map(),
});

const cache = new Map<string, Promise<StreamableValue<string, unknown>>>();

export function Provider({ children }: { children: ReactNode }) {
  return <Context.Provider value={{ cache }}>{children}</Context.Provider>;
}

export function useProvider() {
  return use(Context);
}
