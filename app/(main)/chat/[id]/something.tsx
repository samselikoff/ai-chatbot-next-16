'use client';

import { ClientMessage } from '../../_components/ChatLog';
import { MessageBox } from '../../_components/MessageBox';
import { useProvider } from '../../_components/Provider';
import { continueChat, saveMessage } from './actions';

export function Something({ chatId }: { chatId: string }) {
  const provider = useProvider();

  return (
    <MessageBox
      submitAction={async (message) => {
        const userMessage: ClientMessage = {
          id: window.crypto.randomUUID(),
          content: message,
          role: 'user',
          position: 3,
        };
        const assistantMessage: ClientMessage = {
          id: window.crypto.randomUUID(),
          content: '',
          role: 'assistant',
          position: 4,
        };

        provider.addClientMessages(chatId, [userMessage, assistantMessage]);
        provider.setStreamPromise(continueChat(chatId, message));

        await saveMessage(chatId, userMessage);
      }}
    />
  );
}
