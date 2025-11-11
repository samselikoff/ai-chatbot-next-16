'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  use,
  useActionState,
  useOptimistic,
  useState,
  useSyncExternalStore,
} from 'react';
import { fetchAnswerStream, saveAssistantMessage } from './actions';
import { Stream } from 'openai/streaming';
import { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs';
import { readStreamableValue } from '@ai-sdk/rsc';
import { refresh } from 'next/cache';

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

// let nextId = 0;
// let todos = [{ id: nextId++, text: 'Todo #1' }];
// let listeners = [];

// export const todosStore = {
//   async getCompletion() {
//     // const res = await something();
//     const res = await fetch('http://localhost:3000/api/completions');
//     console.log(res);
//     // await new Promise((resolve) => setTimeout(resolve, 10_000));
//     console.log('done');
//     // todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }];
//     // emitChange();
//   },
//   subscribe(listener) {
//     listeners = [...listeners, listener];
//     return () => {
//       listeners = listeners.filter((l) => l !== listener);
//     };
//   },
//   getSnapshot() {
//     return todos;
//   },
// };

// function emitChange() {
//   for (let listener of listeners) {
//     listener();
//   }
// }

export function Provider({ children }: { children: ReactNode }) {
  // const todos = useSyncExternalStore(
  //   todosStore.subscribe,
  //   todosStore.getSnapshot,
  //   todosStore.getSnapshot
  // );

  // const router = useRouter();
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
  // const [optimisticState, setOptimisticState] = useOptimistic(currentState);

  // const [result, setResult] = useState<null | OpenAIStream>(null);
  // const [optimisticResult, setOptimisticResult] = useOptimistic(results);
  // const [result, setResult] = useState('');
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
