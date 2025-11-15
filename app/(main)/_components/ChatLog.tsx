'use client';

import { useProvider } from '@/app/(main)/_components/Provider';
import { Pulse } from './Pulse';
import { ViewTransition } from 'react';

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
  const content =
    message.status === 'DONE'
      ? message.content
      : provider.streamingMessages[message.id];

  return (
    <div>
      {content ? (
        <p>{content}</p>
      ) : (
        <div className="size-[1lh] flex items-center justify-center">
          <Pulse />
        </div>
      )}

      {message.status === 'DONE' && (
        <ViewTransition>
          <div className="flex mt-2">
            <span className="text-sm text-gray-500">Saved</span>
          </div>
        </ViewTransition>
      )}
    </div>
  );
}
