'use client';

import { ArrowUpIcon } from '@heroicons/react/16/solid';
import { useRef } from 'react';
import invariant from 'tiny-invariant';
import { useProvider } from './Provider';
import { Chat, Message } from './ChatLog';

export function MessageBox({
  // chatPromise,
  submitAction,
}: {
  // chatPromise?: Promise<Chat>;
  submitAction: (messageText: string) => Promise<void>;
}) {
  // const provider = useProvider();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="px-4">
      <form
        ref={formRef}
        className="w-full mb-8 max-w-xl mx-auto group"
        action={async (formData) => {
          const message = formData.get('message');
          invariant(typeof message === 'string');

          if (message === '') return;
          formRef.current?.reset();

          // let chatId: string;
          // let newPosition: number;

          // if (!chatPromise) {
          //   // If there's no existing chat, these are the first messages.
          //   chatId = window.crypto.randomUUID();
          //   newPosition = 1;
          // } else {
          //   // If there's an existing chat, use its ID and max position.
          //   const chat = await chatPromise;
          //   const lastPosition = Math.max(
          //     ...chat.messages.map((m) => m.position)
          //   );
          //   chatId = chat.id;
          //   newPosition = lastPosition + 1;
          // }

          // const userMessage: Message = {
          //   id: window.crypto.randomUUID(),
          //   chatId,
          //   content: message,
          //   role: 'user',
          //   position: newPosition,
          //   status: 'DONE',
          // };
          // const assistantMessage: Message = {
          //   id: window.crypto.randomUUID(),
          //   chatId,
          //   content: '',
          //   role: 'assistant',
          //   position: newPosition + 2,
          //   status: 'INIT',
          // };

          // provider.setOptimisticMessages([userMessage, assistantMessage]);
          // provider.getResponse(assistantMessage, userMessage);

          // await submitAction([userMessage, assistantMessage]);
          await submitAction(message);
        }}
      >
        <div className="relative">
          <input
            name="message"
            type="text"
            placeholder="Ask anything"
            className="border-[0.5px] shadow-md shadow-black/5 py-4 px-6 rounded-full block w-full focus:outline-none border-black/25"
            autoFocus
            required
          />

          <div className="absolute right-2.5 inset-y-2.5 flex items-center justify-center">
            <button
              className="bg-gray-800 enabled:hover:bg-gray-700 text-white font-medium rounded-full w-full h-full aspect-square inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-gray-500 focus-visible:outline-offset-2 group-[:has(input:invalid)]:opacity-50 disabled:opacity-50"
              type="submit"
              // disabled={disabled}
            >
              <ArrowUpIcon className="size-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
