'use client';

import { ArrowUpIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

export function MessageBox({
  submitAction,
}: {
  submitAction: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState('');

  return (
    <form
      action={async () => {
        await submitAction(message);
      }}
      className="w-full mb-8"
    >
      <div className="relative">
        <input
          name="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything"
          className="border-[0.5px] shadow-md shadow-black/5 py-4 px-6 rounded-full block w-full focus:outline-none border-black/25"
          required
          autoFocus
        />

        <div className="absolute right-2.5 inset-y-2.5 flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full w-full h-full aspect-square inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:opacity-50"
            disabled={message === ''}
            type="submit"
          >
            <ArrowUpIcon className="size-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
