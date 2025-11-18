'use client';

import { useRef } from 'react';
import { DemoMessage, saveMessages } from './actions';

export default function Client({ messages }: { messages: DemoMessage[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <main className="grow flex flex-col justify-center max-w-xl mx-auto">
      <h1 className="text-lg mt-20 text-center">
        What can I help you with today?
      </h1>

      <div className="mt-8">
        <form
          action={async (formData) => {
            const message = formData.get('message');
            if (typeof message !== 'string') return;

            formRef.current?.reset();

            const userMessage: DemoMessage = {
              id: window.crypto.randomUUID(),
              content: message,
              role: 'user',
              status: 'DONE',
            };

            const assistantMessage: DemoMessage = {
              id: window.crypto.randomUUID(),
              content: '[assistant response here]',
              role: 'assistant',
              status: 'DONE',
            };

            // TODO: Persist messages
            await saveMessages([userMessage, assistantMessage]);
          }}
          ref={formRef}
        >
          <input
            name="message"
            type="text"
            placeholder="Ask anything"
            className="border-[0.5px] shadow-md shadow-black/5 py-4 px-6 rounded-full block w-full focus:outline-none border-black/25"
            autoFocus
            required
          />
        </form>
      </div>

      <div className="mt-8">
        {messages.map((message) => (
          <p key={message.id}>{message.content}</p>
        ))}
      </div>
    </main>
  );
}
