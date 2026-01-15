"use client";

import { ReactNode } from "react";
import { useOptimisticChats } from "../OptimisticChatsProvider/use-optimistic-chats";

export function HasChats({
  hasServerChats,
  children,
}: {
  hasServerChats: boolean;
  children: ReactNode;
}) {
  const { optimisticChats } = useOptimisticChats();

  return hasServerChats || optimisticChats.length > 0 ? children : null;
}
