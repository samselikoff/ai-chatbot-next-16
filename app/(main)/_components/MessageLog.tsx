"use client";

import { useMessageStreams } from "./MessageStreams/use-message-streams";
import { ViewTransition } from "react";
import { Pulse } from "./Pulse";

export type Chat = { id: string; title?: string | null; messages: Message[] };
export type Message = {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  status: "INIT" | "DONE";
  position: number;
};

export function MessageLog({ messages }: { messages: Message[] }) {
  return (
    <div className="p-4">
      <div className="mx-auto mt-8 max-w-xl space-y-8">
        {messages.map((message) => (
          <div key={message.id} className="flex">
            {message.role === "user" ? (
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
    <p className="ml-auto max-w-2/3 rounded-2xl bg-gray-100 px-4 py-1.5 text-gray-800">
      {message.content}
    </p>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const { messageStreams } = useMessageStreams();

  const content =
    message.status === "DONE" ? message.content : messageStreams[message.id];

  return (
    <div>
      {content ? (
        <p className="whitespace-pre-wrap">{content}</p>
      ) : (
        <div className="flex size-[1lh] items-center justify-center">
          <Pulse />
        </div>
      )}

      {message.status === "DONE" && (
        <ViewTransition>
          <div className="mt-2 flex">
            <span className="text-sm text-gray-500">Saved</span>
          </div>
        </ViewTransition>
      )}
    </div>
  );
}
