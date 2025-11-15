'use client';

import { readStreamableValue } from '@ai-sdk/rsc';
import { createContext, ReactNode, startTransition, useState } from 'react';
import { completeMessage, continueChat } from './actions';
import { Message } from '../MessageLog';

export const Context = createContext<{
  createMessageStream: (
    messages: [userMessage: Message, assistantMessage: Message]
  ) => Promise<void>;
  messageStreams: Partial<Record<string, string>>;
}>({
  createMessageStream: async () => {},
  messageStreams: {},
});

export function MessageStreams({ children }: { children: ReactNode }) {
  const [messageStreams, setMessageStreams] = useState<
    Partial<Record<string, string>>
  >({});

  async function createMessageStream([userMessage, assistantMessage]: [
    userMessage: Message,
    assistantMessage: Message
  ]) {
    const stream = await continueChat(userMessage);

    let response = '';
    for await (const delta of readStreamableValue(stream)) {
      response += delta;
      setMessageStreams((prev) => ({
        ...prev,
        [assistantMessage.id]: response,
      }));
    }

    startTransition(async () => {
      setMessageStreams((prev) => ({
        ...prev,
        [assistantMessage.id]: '',
      }));
      await completeMessage(assistantMessage, response);
    });
  }

  return (
    <Context.Provider
      value={{
        createMessageStream,
        messageStreams,
      }}
    >
      {children}
    </Context.Provider>
  );
}
