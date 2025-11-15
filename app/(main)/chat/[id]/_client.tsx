'use client';

import { Suspense, useOptimistic } from 'react';
import { Await } from '../../_components/Await';
import { Chat, MessageLog, Message } from '../../_components/MessageLog';
import { MessageComposer } from '../../_components/MessageComposer';
import { useMessageStreams } from '../../_components/MessageStreams/use-message-streams';
import Spinner from '../../_components/Spinner';
import { saveMessages } from './actions';

export default function Client({
  chatPromise,
}: {
  chatPromise: Promise<Chat>;
}) {
  const { createMessageStream } = useMessageStreams();
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<Message[]>(
    []
  );

  return (
    <div className="h-dvh flex flex-col">
      <div className="grow overflow-y-auto">
        <Suspense
          fallback={
            <div className="pt-20 flex justify-center">
              <Spinner />
            </div>
          }
        >
          <Await promise={chatPromise}>
            {(chat) => (
              <MessageLog
                messages={[...chat.messages, ...optimisticMessages]}
              />
            )}
          </Await>
        </Suspense>
      </div>

      <MessageComposer
        submitAction={async (messageText) => {
          const chat = await chatPromise;
          const lastPosition = Math.max(
            ...chat.messages.map((m) => m.position)
          );

          const messages: [Message, Message] = [
            {
              id: window.crypto.randomUUID(),
              chatId: chat.id,
              content: messageText,
              role: 'user',
              position: lastPosition + 1,
              status: 'DONE',
            },
            {
              id: window.crypto.randomUUID(),
              chatId: chat.id,
              content: '',
              role: 'assistant',
              position: lastPosition + 2,
              status: 'INIT',
            },
          ];

          setOptimisticMessages(messages);
          createMessageStream(messages);

          await saveMessages(messages);
        }}
      />
    </div>
  );
}
