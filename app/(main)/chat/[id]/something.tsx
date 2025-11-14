'use client';

import { useOptimistic } from 'react';
import { Chat, ChatLog, Message } from '../../_components/ChatLog';
import { MessageBox } from '../../_components/MessageBox';
import { useProvider } from '../../_components/Provider';
import { continueChat, saveMessages } from '../../actions';

export function Something({ chat }: { chat: Chat }) {
  const provider = useProvider();
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    chat.messages
  );

  return (
    <>
      <div className="grow">
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

          provider.cache.set(
            assistantMessage.id,
            continueChat(assistantMessage.chatId, userMessage)
          );

          await saveMessages([userMessage, assistantMessage]);
        }}
      />
    </>
  );
}
