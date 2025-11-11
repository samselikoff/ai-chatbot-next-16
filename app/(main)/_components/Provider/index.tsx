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
  useState,
} from 'react';
import { fetchAnswerStream, saveAssistantMessage } from './actions';

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
  getCompletion: (chatId: string) => Promise<void>;
  // result: null | OpenAIStream;
  results: Partial<Record<string, string>>;
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

  const [results, setResults] = useState<Partial<Record<string, string>>>({});

  async function getCompletion(chatId: string) {
    const answerStream = await fetchAnswerStream();

    let answerText = '';
    for await (const delta of readStreamableValue(answerStream)) {
      answerText += delta;
      setResults((latest) => ({
        ...latest,
        [chatId]: answerText,
      }));
    }

    await saveAssistantMessage(chatId, answerText);
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
        results: results,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return use(Context);
}
