'use client';

import { useMessageStreams } from './MessageStreams/use-message-streams';
import { ViewTransition } from 'react';
import { Pulse } from './Pulse';

export type Chat = { id: string; title?: string | null; messages: Message[] };
export type Message = {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
  position: number;
};

export function MessageLog({ messages }: { messages: Message[] }) {
  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto mt-8 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex">
            {message.role === 'user' ? (
              <UserMessage message={message} />
            ) : (
              <AssistantMessage message={message} />
            )}
          </div>
        ))}
      </div>
    </div>
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
  const { messageStreams } = useMessageStreams();

  const content =
    message.status === 'DONE' ? message.content : messageStreams[message.id];

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
