'use client';

import { useOptimistic } from 'react';
import { ChatLog, ClientChat } from './_components/ChatLog';
import { MessageBox } from './_components/MessageBox';
import { useProvider } from './_components/Provider';
import { createChat } from './actions';

export default function Home() {
  const provider = useProvider();
  const [optimisticChat, setOptimisticChat] = useOptimistic<null | ClientChat>(
    null
  );

  return (
    <div className="h-dvh flex flex-col max-w-2xl mx-auto px-4 justify-center">
      {optimisticChat ? (
        <div className="grow">
          <ChatLog chat={optimisticChat} />
        </div>
      ) : (
        <p className="mb-4 text-center text-3xl">How can I help?</p>
      )}

      <MessageBox
        submitAction={async (message) => {
          const chatId = window.crypto.randomUUID();
          const clientChat: ClientChat = {
            id: chatId,
            messages: [
              {
                id: window.crypto.randomUUID(),
                content: message,
                role: 'user',
                createdAt: undefined,
              },
            ],
          };

          setOptimisticChat(clientChat);

          provider.getCompletion(chatId);

          await createChat(clientChat);
        }}
      />
    </div>
  );
}
