'use client';

import { useProvider } from '@/app/(main)/_components/Provider';
import { useLayoutEffect, useRef } from 'react';

export type ClientChat = { id: string; messages: ClientMessage[] };
export type ClientMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: undefined;
};

export type Chat = { id: string; title?: string | null; messages: Message[] };
export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
};

export function ChatLog({ chat }: { chat: Chat | ClientChat }) {
  const provider = useProvider();
  const optimisticAssistantMessage = provider.results[chat.id];

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto mt-8 space-y-4">
        {chat.messages.map((message) => (
          <div key={message.id} className="flex">
            {message.role === 'user' ? (
              <UserMessage message={message} />
            ) : (
              <AssistantMessage message={message} />
            )}
          </div>
        ))}

        {optimisticAssistantMessage && (
          <AssistantMessage message={optimisticAssistantMessage} />
        )}
      </div>
    </div>
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
  return (
    <div>
      {message.content ? (
        <p>{message.content}</p>
      ) : (
        <div className="size-[1lh] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {message.createdAt && (
        <div className="flex mt-2 ">
          <span className="text-sm text-gray-500">Saved</span>
        </div>
      )}
    </div>
  );
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
