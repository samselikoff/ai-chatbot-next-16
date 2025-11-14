'use client';

import { readStreamableValue, StreamableValue } from '@ai-sdk/rsc';
import {
  createContext,
  ReactNode,
  startTransition,
  use,
  useState,
} from 'react';
import { Message } from '../ChatLog';
import { completeMessage, continueChat } from '../../actions';

const Context = createContext<{
  cache: Map<string, Promise<StreamableValue<string, unknown>>>;
  getResponse: (
    assistantMessage: Message,
    userMessage: Message
  ) => Promise<void>;
  streamText: string;
}>({
  cache: new Map(),
  getResponse: async () => {},
  streamText: '',
});

const cache = new Map<string, Promise<StreamableValue<string, unknown>>>();

export function Provider({ children }: { children: ReactNode }) {
  const [streamText, setStreamText] = useState('');

  async function getResponse(assistantMessage: Message, userMessage: Message) {
    const stream = await continueChat(userMessage);

    let response = '';
    for await (const delta of readStreamableValue(stream)) {
      response += delta;
      setStreamText(response);
    }

    startTransition(async () => {
      setStreamText('');
      await completeMessage(assistantMessage, response);
    });
  }

  return (
    <Context.Provider value={{ cache, getResponse, streamText }}>
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return use(Context);
}
