'use client';

import { readStreamableValue, StreamableValue } from '@ai-sdk/rsc';
import { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs';
import { Stream } from 'openai/streaming';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  use,
  useActionState,
  useOptimistic,
  useState,
} from 'react';
import { fetchAnswerStream, saveAssistantMessage } from './actions';
import { ClientMessage } from '../ChatLog';
import { createChat } from '../../actions';
import { redirect, useRouter } from 'next/navigation';

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
      // id: string;
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
  results: Partial<Record<string, ClientMessage[]>>;
  addClientMessages: (chatId: string, messages: ClientMessage[]) => void;
  streamPromise: Partial<
    Record<string, Promise<StreamableValue<string, unknown>>>
  >;
  setStreamPromise: Dispatch<
    SetStateAction<
      Partial<Record<string, Promise<StreamableValue<string, unknown>>>>
    >
  >;
  cache: Map<string, Promise<StreamableValue<string, unknown>>>;
}>({
  state: initialState,
  dispatch: () => {},
  getCompletion: async () => {},
  results: {},
  addClientMessages: () => {},
  streamPromise: {},
  setStreamPromise: () => {},
  cache: new Map(),
});

const cache = new Map<string, Promise<StreamableValue<string, unknown>>>();

export function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [streamPromise, setStreamPromise] = useState<
    Partial<Record<string, Promise<StreamableValue<string, unknown>>>>
  >({});
  const [currentState, dispatch] = useActionState(
    async (state: State, action: Action): Promise<State> => {
      switch (action.type) {
        case 'createChat':
          // console.log('?');
          // setOptimisticState({
          //   status: 'will-create-chat',
          //   id: action.id,
          //   message: action.message,
          // });
          // await createChat(action.id, action.message);
          console.log('before');
          // const chat = await createChat(action.message);
          // console.log(chat);
          // router.push(`/chat/${chat.id}`);
          console.log('after');

        // return { status: 'idle' };
        default:
          return state;
      }
    },
    initialState
  );

  // console.log('rendering provider...');

  const [results, setResults] = useState<
    Partial<Record<string, ClientMessage[]>>
  >({});
  const [optimisticResults, setOptimisticResults] = useOptimistic(results);

  function addClientMessages(chatId: string, clientMessages: ClientMessage[]) {
    //
    // setOptimisticResults((results) => [...results, ...clientMessages]);
    setOptimisticResults((results) => ({
      ...results,
      [chatId]: [
        ...(results[chatId] ? results[chatId] : []),
        ...clientMessages,
      ],
    }));
  }

  /*
    streamText version
  */
  async function getCompletion(chatId: string, content: string) {
    const assistantMessage: ClientMessage = {
      id: window.crypto.randomUUID(),
      content: '',
      role: 'assistant',
      position: 2,
    };
    setOptimisticResults((latest) => ({
      ...latest,
      [chatId]: [assistantMessage],
    }));
    const answerStream = await fetchAnswerStream(content);

    for await (const delta of readStreamableValue(answerStream)) {
      assistantMessage.content += delta;
      // await new Promise((resolve) => setTimeout(resolve, 100));
      setOptimisticResults((latest) => ({
        // setResults((latest) => ({
        ...latest,
        [chatId]: [assistantMessage],
      }));
    }

    await saveAssistantMessage(chatId, assistantMessage);
    redirect(`/chat/${chatId}`);
    // setResults((latest) => {
    //   delete latest[chatId];
    //   return latest;
    // });
  }

  /*
    Open AI SDK version. Blocks in dev.
  */
  // async function getCompletion(chatId: string, content: string) {
  //   const assistantMessage: ClientMessage = {
  //     id: window.crypto.randomUUID(),
  //     content: '',
  //     role: 'assistant',
  //     createdAt: undefined,
  //   };
  //   setOptimisticResults((latest) => ({
  //     ...latest,
  //     [chatId]: assistantMessage,
  //   }));
  //   const answerStream = await fetchAnswerStream(content);

  //   for await (const chunk of answerStream) {
  //     if (chunk.type === 'response.output_text.delta') {
  //       assistantMessage.content += chunk.delta;
  //       setResults((latest) => ({
  //         ...latest,
  //         [chatId]: assistantMessage,
  //       }));
  //     }
  //   }

  //   // await saveAssistantMessage(chatId, assistantMessage);
  //   // setResults((latest) => {
  //   //   delete latest[chatId];
  //   //   return latest;
  //   // });
  // }

  /*
    Open AI HTTP version
  */
  // async function getCompletion(chatId: string, content: string) {
  //   const assistantMessage: ClientMessage = {
  //     id: window.crypto.randomUUID(),
  //     content: '',
  //     role: 'assistant',
  //     createdAt: undefined,
  //   };
  //   setOptimisticResults((latest) => ({
  //     ...latest,
  //     [chatId]: assistantMessage,
  //   }));
  //   const answerStream = await fetchAnswerStream(content);
  //   console.log(answerStream);

  //   if (answerStream instanceof Response) {
  //     return;
  //   }

  //   const reader = answerStream!.getReader();
  //   const decoder = new TextDecoder();

  //   while (true) {
  //     const iter = await reader.read();
  //     // console.l
  //     console.log(iter.done);
  //     if (iter.done) break;
  //     const chunk = decoder.decode(iter.value);
  //     console.log('---NEW CHUNK----');
  //     const data = chunk.split('\n')[1].replace('data: ', '');
  //     const json = JSON.parse(data);
  //     console.log(json);

  //     if (json.type === 'response.output_text.delta') {
  //       assistantMessage.content += json.delta;
  //       setResults((latest) => ({
  //         ...latest,
  //         [chatId]: assistantMessage,
  //       }));
  //     }
  //   }

  //   // for await (const chunk of answerStream) {
  //   //   if (chunk.type === 'response.output_text.delta') {
  //   //     assistantMessage.content += chunk.delta;
  //   //     setResults((latest) => ({
  //   //       ...latest,
  //   //       [chatId]: assistantMessage,
  //   //     }));
  //   //   }
  //   // }

  //   // await saveAssistantMessage(chatId, assistantMessage);
  //   // setResults((latest) => {
  //   //   delete latest[chatId];
  //   //   return latest;
  //   // });
  // }

  return (
    <Context.Provider
      value={{
        state: currentState,
        dispatch,
        getCompletion,
        results: optimisticResults,
        addClientMessages,
        streamPromise,
        setStreamPromise,
        cache,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return use(Context);
}
