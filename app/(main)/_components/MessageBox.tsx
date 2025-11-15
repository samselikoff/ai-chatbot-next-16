'use client';

import { ArrowUpIcon } from '@heroicons/react/16/solid';
import { useState, useTransition } from 'react';
import invariant from 'tiny-invariant';

export function MessageBox({
  submitAction,
}: {
  submitAction: (message: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const disabled = message === '';

  return (
    <div className="px-4">
      <form
        action={async () => {
          if (disabled) return;

          startTransition(async () => {
            setMessage('');
            await submitAction(message);
          });
        }}
        className="w-full mb-8 max-w-xl mx-auto"
      >
        <div className="relative">
          <input
            name="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything"
            className="border-[0.5px] shadow-md shadow-black/5 py-4 px-6 rounded-full block w-full focus:outline-none border-black/25"
            autoFocus
          />

          <div className="absolute right-2.5 inset-y-2.5 flex items-center justify-center">
            <button
              className="bg-gray-800 enabled:hover:bg-gray-700 text-white font-medium rounded-full w-full h-full aspect-square inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-gray-500 focus-visible:outline-offset-2 disabled:opacity-50"
              type="submit"
              disabled={disabled}
            >
              <ArrowUpIcon className="size-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
