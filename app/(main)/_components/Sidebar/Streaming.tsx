"use client";

import { Dots } from "@/components/Dots";
import { ReactNode } from "react";
import { useOptimisticChats } from "../OptimisticChatsProvider/use-optimistic-chats";

export function Streaming({
  isStreaming,
  chatId,
  children,
}: {
  isStreaming: boolean;
  chatId: string;
  children: ReactNode;
}) {
  const { streamingChatIds } = useOptimisticChats();

  if (isStreaming || streamingChatIds.includes(chatId)) {
    return (
      <span className="mr-2 inline-flex items-center">
        <Dots />
      </span>
    );
  }

  return children;
}
