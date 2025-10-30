'use client';

import { createContext, ReactNode, use, useState } from 'react';

const Context = createContext<{
  newMessage: string;
  setNewMessage: (v: string) => void;
}>({
  newMessage: '',
  setNewMessage: () => {},
});

export function Provider({ children }: { children: ReactNode }) {
  const [newMessage, setNewMessage] = useState('');

  return (
    <Context.Provider value={{ newMessage, setNewMessage }}>
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return use(Context);
}
