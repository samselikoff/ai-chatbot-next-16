"use server";

import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Chat } from "../_components/MessageLog";
import { getCurrentUser } from "@/lib/get-current-user";
import { refresh } from "next/cache";

export async function createChat(clientChat: Chat) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const [existingChatCount] = await db
    .select({ count: count() })
    .from(chats)
    .where(eq(chats.userId, user.id));

  await db
    .insert(chats)
    .values({
      id: clientChat.id,
      userId: user.id,
      title: `Chat ${existingChatCount.count + 1}`,
    })
    .returning();

  await db.insert(messages).values(clientChat.messages);

  refresh();
  redirect(`/chat/${clientChat.id}`);
}
