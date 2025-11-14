'use client';

import { useProvider } from '@/app/(main)/_components/Provider';
import { readStreamableValue, StreamableValue } from '@ai-sdk/rsc';
import { Suspense, use, useEffect, useRef, useState } from 'react';
import { completeMessage } from '../actions';
import Spinner from './Spinner';

export type Chat = { id: string; title?: string | null; messages: Message[] };
export type Message = {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
  position: number;
};

export function ChatLog({ messages }: { messages: Message[] }) {
  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto mt-8 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex">
            <Message message={message} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Message({ message }: { message: Message }) {
  return message.role === 'user' ? (
    <UserMessage message={message} />
  ) : (
    <AssistantMessage message={message} />
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <p className="bg-gray-200 px-4 text-gray-800 py-1 rounded-full ml-auto">
      {message.content}
    </p>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const provider = useProvider();

  if (message.status === 'DONE') {
    return (
      <div>
        <p>{message.content}</p>
        <div className="flex mt-2">
          <span className="text-sm text-gray-500">Saved</span>
        </div>
      </div>
    );
  }

  const stream = provider.cache.get(message.id);

  if (!stream) {
    return <p>Failed stream</p>;
  }

  return (
    <Suspense
      fallback={
        <div className="size-[1lh] flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <StreamReader
        streamPromise={stream}
        completeAction={async (streamValue) => {
          await completeMessage(message.id, streamValue, message.chatId);
        }}
      />
    </Suspense>
  );
}

function StreamReader({
  streamPromise,
  completeAction,
}: {
  streamPromise: Promise<StreamableValue<string, unknown>>;
  completeAction: (result: string) => Promise<void>;
}) {
  const stream = use(streamPromise);
  const [response, setResponse] = useState('');
  const hasStarted = useRef(false);

  useEffect(() => {
    // console.log('1');
    if (hasStarted.current) return;
    // console.log('2');
    hasStarted.current = true;
    // console.log('3');
    async function f() {
      // console.log('4');
      let message = '';
      for await (const delta of readStreamableValue(stream)) {
        // console.log('5');
        // console.log(delta);
        message += delta;
        setResponse(message);
      }

      // console.log('6');
      await completeAction(message);
    }

    f();
  }, [completeAction, stream]);

  return response ? (
    <p>{response}</p>
  ) : (
    <div className="size-[1lh] flex items-center justify-center">
      <Spinner />
    </div>
  );
}
