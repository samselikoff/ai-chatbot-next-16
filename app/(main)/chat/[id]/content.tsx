'use client';

import { useOptimistic } from 'react';
import { Chat, ChatLog, Message } from '../../_components/ChatLog';
import { MessageBox } from '../../_components/MessageBox';
import { useProvider } from '../../_components/Provider';
import { saveMessages } from '../../actions';

export function Content({ chat }: { chat: Chat }) {
  const provider = useProvider();
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    chat.messages
  );

  return (
    <>
      <div className="grow overflow-y-auto">
        <ChatLog messages={optimisticMessages} />
      </div>

      <MessageBox
        submitAction={async (message) => {
          const lastPosition = Math.max(
            ...chat.messages.map((m) => m.position)
          );

          const userMessage: Message = {
            id: window.crypto.randomUUID(),
            chatId: chat.id,
            content: message,
            role: 'user',
            position: lastPosition + 1,
            status: 'DONE',
          };
          const assistantMessage: Message = {
            id: window.crypto.randomUUID(),
            chatId: chat.id,
            content: '',
            role: 'assistant',
            position: lastPosition + 2,
            status: 'INIT',
          };

          setOptimisticMessages((prev) => [
            ...prev,
            userMessage,
            assistantMessage,
          ]);

          provider.getResponse(assistantMessage, userMessage);

          await saveMessages([userMessage, assistantMessage]);
        }}
      />
    </>
  );
}
