'use client';

import { useState } from 'react';
import { useProvider } from '../../../_components/Provider';
import { type Chat, ChatLog } from './ChatLog';

export function OptimisticChat({ id }: { id: string }) {
  const { state } = useProvider();
  const [optimisticChat] = useState(() => {
    if (state.status === 'will-create-chat') {
      const chat: Chat = {
        id: state.id,
        title: 'New chat',
        messages: [{ id: state.id, content: state.message }],
      };
      return chat;
    } else {
      return null;
    }
  });

  if (optimisticChat === null) {
    return null;
  }

  return <ChatLog chat={optimisticChat} />;
}
