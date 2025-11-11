'use client';

import { useProvider } from '@/app/(main)/_components/Provider';
import clsx from 'clsx';

export type ClientChat = { id: string; messages: ClientMessage[] };
export type ClientMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: undefined;
};

export type Chat = { id: string; title?: string | null; messages: Message[] };
export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
};

export function ChatLog({ chat }: { chat: Chat | ClientChat }) {
  const provider = useProvider();
  const optimisticResponse = provider.results[chat.id];

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto mt-8 space-y-4">
        {chat.messages.map((message) => (
          <div key={message.id} className="flex">
            {message.role === 'user' ? (
              <UserMessage message={message} />
            ) : (
              <AssistantMessage message={message} />
            )}
          </div>
        ))}

        {optimisticResponse && <p>{optimisticResponse}</p>}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message | ClientMessage }) {
  return (
    <p className="bg-gray-200 px-4 text-gray-800 py-1 rounded-full ml-auto">
      {message.content}
    </p>
  );
}

function AssistantMessage({ message }: { message: Message | ClientMessage }) {
  return (
    <div>
      <p>{message.content}</p>
      {message.createdAt && (
        <div className="flex mt-2">
          <span className="text-sm text-gray-500">Saved</span>
        </div>
      )}
    </div>
  );
}
