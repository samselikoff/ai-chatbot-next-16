'use client';

import { readStreamableValue } from '@ai-sdk/rsc';
import { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs';
import { Stream } from 'openai/streaming';
import {
  createContext,
  Dispatch,
  ReactNode,
  use,
  useActionState,
  useOptimistic,
  useState,
} from 'react';
import { fetchAnswerStream, saveAssistantMessage } from './actions';
import { ClientMessage } from '../ChatLog';

type State =
  | {
      status: 'idle';
      effect?: () => Action;
    }
  | {
      status: 'will-create-chat';
      id: string;
      message: string;
      effect?: () => Action;
    };

type Action =
  | {
      type: 'createChat';
      id: string;
      message: string;
    }
  | { type: 'reset' };

export type OpenAIStream = Stream<ResponseStreamEvent> & {
  _request_id?: string | null;
};

const initialState: State = { status: 'idle' };

const Context = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
  getCompletion: (chatId: string, message: string) => Promise<void>;
  // result: null | OpenAIStream;
  results: Partial<Record<string, ClientMessage>>;
}>({
  state: initialState,
  dispatch: () => {},
  getCompletion: async () => {},
  results: {},
});

export function Provider({ children }: { children: ReactNode }) {
  const [currentState, dispatch] = useActionState(
    async (state: State, action: Action): Promise<State> => {
      switch (action.type) {
        case 'createChat':
          console.log('?');
          // setOptimisticState({
          //   status: 'will-create-chat',
          //   id: action.id,
          //   message: action.message,
          // });
          // await createChat(action.id, action.message);
          // router.push(`/chat/${action.id}`);

          return { status: 'idle' };
        default:
          return state;
      }
    },
    initialState
  );

  const [results, setResults] = useState<
    Partial<Record<string, ClientMessage>>
  >({});
  const [optimisticResults, setOptimisticResults] = useOptimistic(results);

  async function getCompletion(chatId: string, content: string) {
    const assistantMessage: ClientMessage = {
      id: window.crypto.randomUUID(),
      content: '',
      role: 'assistant',
      createdAt: undefined,
    };
    setOptimisticResults((latest) => ({
      ...latest,
      [chatId]: assistantMessage,
    }));
    const answerStream = await fetchAnswerStream(content);

    for await (const delta of readStreamableValue(answerStream)) {
      assistantMessage.content += delta;
      setResults((latest) => ({
        ...latest,
        [chatId]: assistantMessage,
      }));
    }

    await saveAssistantMessage(chatId, assistantMessage);
    setResults((latest) => {
      delete latest[chatId];
      return latest;
    });
  }

  return (
    <Context.Provider
      value={{
        state: currentState,
        dispatch,
        getCompletion,
        results: optimisticResults,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return use(Context);
}
