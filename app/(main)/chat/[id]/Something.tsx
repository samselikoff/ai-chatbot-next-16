'use client';

import { useEffect, useRef } from 'react';
import { doSomething } from '../../actions';
import { useProvider } from '../../_components/Provider';

export function Something({ id }: { id: string }) {
  const didRun = useRef(false);
  const { newMessage } = useProvider();

  useEffect(() => {
    if (!didRun.current && newMessage) {
      doSomething(id, newMessage);
      didRun.current = true;
    }
  }, [id, newMessage]);

  return (
    <div className="p-4">
      <p className="text-center font-semibold">New chat</p>

      <div className="max-w-lg mx-auto mt-8">
        <p className="text-right">{newMessage}</p>
      </div>
    </div>
  );
}
