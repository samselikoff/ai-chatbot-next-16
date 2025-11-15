'use client';

import { useProvider } from '@/app/(main)/_components/Provider';
import { Suspense, use, ViewTransition } from 'react';
import { saveMessages } from '../actions';
import { MessageBox } from './MessageBox';
import { Pulse } from './Pulse';
import Spinner from './Spinner';

export type Chat = { id: string; title?: string | null; messages: Message[] };
export type Message = {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
  position: number;
};

export function ChatLog({ messages }: { messages: Message[] }) {
  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto mt-8 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex">
            {message.role === 'user' ? (
              <UserMessage message={message} />
            ) : (
              <AssistantMessage message={message} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
  // const provider = useProvider();

  // return (
  //   <div className="h-dvh flex flex-col">
  //     <div className="grow overflow-y-auto">
  //       <Suspense
  //         fallback={
  //           <div className="pt-20 flex justify-center">
  //             <Spinner />
  //           </div>
  //         }
  //       >
  //         <Something chatPromise={chatPromise} />
  //       </Suspense>
  //     </div>

  //     <MessageBox
  //       chatPromise={chatPromise}
  //       submitAction={async ([userMessage, assistantMessage]) => {
  //         await saveMessages([userMessage, assistantMessage]);
  //       }}
  //     />
  //   </div>
  // );
}

// function Something({ chatPromise }: { chatPromise: Promise<Chat> }) {
//   const chat = use(chatPromise);
//   const provider = useProvider();

//   return (
//     <Messages messages={[...chat.messages, ...provider.optimisticMessages]} />
//   );
// }

// function Messages({ messages }: { messages: Message[] }) {
//   return (
//     <div className="p-4">
//       <div className="max-w-xl mx-auto mt-8 space-y-4">
//         {messages.map((message) => (
//           <div key={message.id} className="flex">
//             <Message message={message} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function Message({ message }: { message: Message }) {
//   return message.role === 'user' ? (
//     <UserMessage message={message} />
//   ) : (
//     <AssistantMessage message={message} />
//   );
// }

function UserMessage({ message }: { message: Message }) {
  return (
    <p className="bg-gray-200 px-4 text-gray-800 py-1 rounded-full ml-auto">
      {message.content}
    </p>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const provider = useProvider();
  const content =
    message.status === 'DONE'
      ? message.content
      : provider.streamingMessages[message.id];

  return (
    <div>
      {content ? (
        <p>{content}</p>
      ) : (
        <div className="size-[1lh] flex items-center justify-center">
          <Pulse />
        </div>
      )}

      {message.status === 'DONE' && (
        <ViewTransition>
          <div className="flex mt-2">
            <span className="text-sm text-gray-500">Saved</span>
          </div>
        </ViewTransition>
      )}
    </div>
  );
}
