'use client';

import { useProvider } from '@/app/(main)/_components/Provider';
import {
  Suspense,
  use,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Spinner from './Spinner';
import { readStreamableValue, StreamableValue } from '@ai-sdk/rsc';
import { saveAssistantMessage } from './Provider/actions';
import { completeMessage } from '../actions';

export type ClientChat = { id: string; messages: ClientMessage[] };
export type ClientMessage = {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
  position: number;
  createdAt?: undefined;
};

export type Chat = { id: string; title?: string | null; messages: Message[] };
export type Message = {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
  position: number;
  createdAt: Date;
};

export function ChatLog({ chat }: { chat: Chat | ClientChat }) {
  // const provider = useProvider();
  // const clientMessages = provider.results[chat.id] ?? [];
  // const allMessages = [...chat.messages, ...clientMessages];

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto mt-8 space-y-4">
        {chat.messages.map((message) => (
          <div key={message.id} className="flex">
            <Message message={message} />
          </div>
        ))}
      </div>

      {/* {provider.streamPromise && (
        <StreamReader
          streamPromise={provider.streamPromise}
          completeAction={async (streamResult) => {
            const message: ClientMessage = {
              id: window.crypto.randomUUID(),
              content: streamResult,
              role: 'assistant',
              position: Math.max(...allMessages.map((m) => m.position)) + 1,
            };

            provider.setStreamPromise(null);
            await saveAssistantMessage(chat.id, message);
          }}
        />
      )} */}
    </div>
  );
}

function Message({ message }: { message: Message | ClientMessage }) {
  return message.role === 'user' ? (
    <UserMessage message={message} />
  ) : (
    <AssistantMessage message={message} />
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
  const provider = useProvider();

  if (message.status === 'DONE') {
    return (
      <div>
        <p>{message.content}</p>
        <div className="flex mt-2">
          <span className="text-sm text-gray-500">Saved</span>
        </div>
      </div>
    );
  }

  const stream = provider.cache.get(message.id);

  if (!stream) {
    return <p>Failed stream</p>;
  }

  return (
    <StreamReader
      streamPromise={stream}
      completeAction={async (streamValue) => {
        await completeMessage(message.id, streamValue, message.chatId);
      }}
    />
  );

  // return (
  //   <div>
  //     {message.content ? (
  //       <p>{message.content}</p>
  //     ) : (
  //       <div className="size-[1lh] flex items-center justify-center">
  //         <Spinner />
  //       </div>
  //     )}

  //     {message.createdAt && (
  //       <div className="flex mt-2">
  //         <span className="text-sm text-gray-500">Saved</span>
  //       </div>
  //     )}
  //   </div>
  // );
}

function StreamReader({
  streamPromise,
  completeAction,
}: {
  streamPromise: Promise<StreamableValue<string, unknown>>;
  completeAction: (result: string) => Promise<void>;
}) {
  const stream = use(streamPromise);
  const [response, setResponse] = useState('');
  const hasStarted = useRef(false);

  useEffect(() => {
    console.log('1');
    if (hasStarted.current) return;
    console.log('2');
    hasStarted.current = true;
    console.log('3');
    async function f() {
      console.log('4');
      let message = '';
      for await (const delta of readStreamableValue(stream)) {
        // console.log('5');
        // console.log(delta);
        message += delta;
        setResponse(message);
      }

      console.log('6');
      await completeAction(message);
    }

    f();
  }, [completeAction, stream]);

  return response ? (
    <p>{response}</p>
  ) : (
    <div className="size-[1lh] flex items-center justify-center">
      <Spinner />
    </div>
  );

  // return <p>{response}</p>;
}

const keyframes = `
  @keyframes scale {
    0%,
    100% {
      opacity: 50%;
      scale: 80%;
    }
    50% {
      opacity: 100%;
      scale: 100%;
    }
  } 
`;
let stashedTime: number;
function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   const animations = document
  //     .getAnimations()
  //     .filter((animation) => animation instanceof CSSAnimation)
  //     .filter((animation) => animation.animationName === 'scale');

  //   const myAnimation = animations.find(
  //     (animation) => animation.effect?.target === ref.current
  //   );

  //   if (myAnimation === animations[0] && stashedTime) {
  //     myAnimation.currentTime = stashedTime;
  //   }

  //   if (myAnimation !== animations[0]) {
  //     myAnimation.currentTime = animations[0].currentTime;
  //   }

  //   return () => {
  //     if (myAnimation === animations[0]) {
  //       stashedTime = myAnimation.currentTime;
  //     }
  //   };
  // }, []);

  return (
    <>
      <style>{keyframes}</style>
      <div
        ref={ref}
        className="size-3 animate-[scale_1s_infinite] bg-gray-900 rounded-full"
      />
    </>
  );
}
