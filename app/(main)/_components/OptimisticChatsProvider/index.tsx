"use client";

import { createContext, ReactNode, useOptimistic } from "react";

type OptimisticChat = {
  id: string;
  title: string | null;
  isStreaming: boolean;
};

export const Context = createContext<{
  optimisticChats: OptimisticChat[];
  setOptimisticChats: (
    action:
      | OptimisticChat[]
      | ((pendingState: OptimisticChat[]) => OptimisticChat[]),
  ) => void;
  streamingChatIds: string[];
  setStreamingChatIds: (
    action: string[] | ((pendingState: string[]) => string[]),
  ) => void;
}>({
  optimisticChats: [],
  setOptimisticChats: () => {},
  streamingChatIds: [],
  setStreamingChatIds: () => {},
});

export default function OptimisticChatsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [optimisticChats, setOptimisticChats] = useOptimistic<OptimisticChat[]>(
    [],
  );
  const [streamingChatIds, setStreamingChatIds] = useOptimistic<string[]>([]);

  return (
    <Context
      value={{
        optimisticChats,
        setOptimisticChats,
        streamingChatIds,
        setStreamingChatIds,
      }}
    >
      {children}
    </Context>
  );
}
