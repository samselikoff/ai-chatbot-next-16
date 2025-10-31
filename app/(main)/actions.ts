'use server';

import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
import { count, eq } from 'drizzle-orm';
import { refresh } from 'next/cache';
import { redirect, RedirectType } from 'next/navigation';
import { after } from 'next/server';

export async function createChat(id: string, message: string) {
  // after(async () => {
  const user = await stackServerApp.getUser();
  if (!user) {
    return;
  }

  const [existingChatCount] = await db
    .select({ count: count() })
    .from(chats)
    .where(eq(chats.userId, user.id));

  const [newChat] = await db
    .insert(chats)
    .values({
      id,
      userId: user.id,
      title: `Chat ${existingChatCount.count + 1}`,
    })
    .returning();

  await db
    .insert(messages)
    .values({ chatId: newChat.id, content: message, position: 1 });

  await new Promise((resolve) => setTimeout(resolve, 2_000));

  // redirect(`/chat/${newChat.id}`, RedirectType.replace);
  // });

  // refresh();
  redirect(`/chat/${newChat.id}`, RedirectType.replace);

  // redirect(`/chat/${id}?new`);
}
