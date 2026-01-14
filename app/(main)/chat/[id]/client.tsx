"use client";

import { useOptimistic } from "react";
import { MessageComposer } from "../../_components/MessageComposer";
import { Chat, Message, MessageLog } from "../../_components/MessageLog";
import { useMessageStreams } from "../../_components/MessageStreams/use-message-streams";
import { saveMessages } from "./actions";
import { useOptimisticChats } from "../../_components/OptimisticChatsProvider/use-optimistic-chats";

export default function Client({ chat }: { chat: Chat }) {
  const { createMessageStream } = useMessageStreams();
  const { setStreamingChatIds } = useOptimisticChats();
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<Message[]>(
    [],
  );
  const allMessages = [...chat.messages, ...optimisticMessages];
  const isStreaming = allMessages.some((m) => m.status === "INIT");

  return (
    <div className="flex h-dvh flex-col">
      <div className="grow overflow-y-auto">
        <MessageLog messages={allMessages} />
      </div>

      <MessageComposer
        disabled={isStreaming}
        submitAction={async (messageText) => {
          const lastPosition = Math.max(
            ...chat.messages.map((m) => m.position),
          );

          const messages: [Message, Message] = [
            {
              id: window.crypto.randomUUID(),
              chatId: chat.id,
              content: messageText,
              role: "user",
              position: lastPosition + 1,
              status: "DONE",
            },
            {
              id: window.crypto.randomUUID(),
              chatId: chat.id,
              content: "",
              role: "assistant",
              position: lastPosition + 2,
              status: "INIT",
            },
          ];

          setOptimisticMessages(messages);
          setStreamingChatIds((ids) => [...ids, chat.id]);

          createMessageStream(messages);

          await saveMessages(messages);
        }}
      />
    </div>
  );
}
