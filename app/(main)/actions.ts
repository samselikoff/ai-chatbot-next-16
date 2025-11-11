'use server';

import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
import { count, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ClientChat } from './_components/ChatLog';

export async function createChat(unsafeChatData: ClientChat) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return;
  }

  const [existingChatCount] = await db
    .select({ count: count() })
    .from(chats)
    .where(eq(chats.userId, user.id));

  const [chat] = await db
    .insert(chats)
    .values({
      id: unsafeChatData.id,
      userId: user.id,
      title: `Chat ${existingChatCount.count + 1}`,
    })
    .returning();

  await db.insert(messages).values({
    id: unsafeChatData.messages[0].id,
    chatId: chat.id,
    content: unsafeChatData.messages[0].content,
    position: 1,
    role: 'user',
  });

  redirect(`/chat/${chat.id}`);
}
