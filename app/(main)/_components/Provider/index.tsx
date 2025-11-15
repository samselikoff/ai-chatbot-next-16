'use client';

import { readStreamableValue } from '@ai-sdk/rsc';
import {
  createContext,
  ReactNode,
  startTransition,
  use,
  useState,
} from 'react';
import { completeMessage, continueChat } from '../../actions';
import { Message } from '../MessageLog';

const Context = createContext<{
  getResponse: (
    assistantMessage: Message,
    userMessage: Message
  ) => Promise<void>;
  streamingMessages: Partial<Record<string, string>>;
}>({
  getResponse: async () => {},
  streamingMessages: {},
});

export function Provider({ children }: { children: ReactNode }) {
  const [streamingMessages, setStreamingMessages] = useState<
    Partial<Record<string, string>>
  >({});

  async function getResponse(assistantMessage: Message, userMessage: Message) {
    const stream = await continueChat(userMessage);

    let response = '';
    for await (const delta of readStreamableValue(stream)) {
      response += delta;
      setStreamingMessages((prev) => ({
        ...prev,
        [assistantMessage.id]: response,
      }));
    }

    startTransition(async () => {
      setStreamingMessages((prev) => ({
        ...prev,
        [assistantMessage.id]: '',
      }));
      await completeMessage(assistantMessage, response);
    });
  }

  return (
    <Context.Provider
      value={{
        getResponse,
        streamingMessages,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return use(Context);
}
