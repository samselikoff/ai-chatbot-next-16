'use client';

import { Await } from '@/app/(main)/_components/Await';
import { Suspense, useOptimistic, useRef } from 'react';
import { DemoMessage, saveMessages } from './actions';

export default function Client({
  messagesPromise,
}: {
  messagesPromise: Promise<DemoMessage[]>;
}) {
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<
    DemoMessage[]
  >([]);
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

            setOptimisticMessages((current) => [
              ...current,
              userMessage,
              assistantMessage,
            ]);

            try {
              await saveMessages([userMessage, assistantMessage]);
            } catch (error) {
              console.error(error);
            }
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
        <Suspense>
          <Await promise={messagesPromise}>
            {(messages) => (
              <MessageLog messages={[...messages, ...optimisticMessages]} />
            )}
          </Await>
        </Suspense>
      </div>
    </main>
  );
}

function MessageLog({ messages }: { messages: DemoMessage[] }) {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </>
  );
}
