"use client";

import { Dots } from "@/components/Dots";
import { NavLink } from "@/components/NavLink";
import { ChatLinkMenu } from "./ChatLinkMenu";
import { useOptimisticChats } from "../OptimisticChatsProvider/use-optimistic-chats";

export function OptimisticChats() {
  const { optimisticChats } = useOptimisticChats();

  return (
    <>
      {optimisticChats.map((chat) => (
        <div key={chat.id} className="group relative mx-2">
          <NavLink
            href={`/chat/${chat.id}`}
            className="block w-full min-w-0 items-center justify-between truncate rounded-lg bg-gray-300 py-2 pr-6 pl-3 text-sm text-gray-900 group-has-data-popup-open:bg-gray-200"
          >
            {chat.title}
          </NavLink>

          <div className="absolute inset-y-0 right-0 flex items-center">
            {chat.isStreaming ? (
              <span className="mr-2 inline-flex items-center">
                <Dots />
              </span>
            ) : (
              <ChatLinkMenu chatId={chat.id} chatTitle={chat.title ?? ""} />
            )}
          </div>
        </div>
      ))}
    </>
  );
}
