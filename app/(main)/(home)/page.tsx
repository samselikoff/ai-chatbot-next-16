'use client';

import { useOptimistic } from 'react';
import { Chat, MessageLog, Message } from '../_components/MessageLog';
import { MessageComposer } from '../_components/MessageComposer';
import { useMessageStreams } from '../_components/MessageStreams';
import { createChat } from './actions';

export default function Home() {
  const provider = useMessageStreams();
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<Message[]>(
    []
  );

  return (
    <div className="h-dvh flex flex-col max-w-2xl mx-auto justify-center">
      {optimisticMessages.length > 0 ? (
        <div className="grow">
          <MessageLog messages={optimisticMessages} />
        </div>
      ) : (
        <p className="mb-4 text-center text-3xl">How can I help?</p>
      )}

      <MessageComposer
        submitAction={async (input) => {
          const clientChatId = window.crypto.randomUUID();
          const clientChat: Chat = {
            id: clientChatId,
            messages: [
              {
                id: window.crypto.randomUUID(),
                chatId: clientChatId,
                content: input,
                role: 'user',
                status: 'DONE',
                position: 1,
              },
              {
                id: window.crypto.randomUUID(),
                chatId: clientChatId,
                content: '',
                role: 'assistant',
                status: 'INIT',
                position: 2,
              },
            ],
          };

          setOptimisticMessages(clientChat.messages);

          provider.getResponse(clientChat.messages[1], clientChat.messages[0]);

          await createChat(clientChat);
        }}
      />
    </div>
  );
}
