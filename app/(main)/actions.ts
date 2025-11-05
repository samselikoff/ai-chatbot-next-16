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
  // await new Promise((resolve) => setTimeout(resolve, 2_000));
  // console.time('createChat');
  const user = await stackServerApp.getUser();
  // console.timeLog('createChat', 'getUser');

  if (!user) {
    return;
  }
  // await new Promise((resolve) => setTimeout(resolve, 5_000));

  // const user = { id: 'c332348b-30f9-4747-981f-22721233eeef' };

  const [existingChatCount] = await db
    .select({ count: count() })
    .from(chats)
    .where(eq(chats.userId, user.id));

  // console.timeLog('createChat', 'existingChatCount');

  const [newChat] = await db
    .insert(chats)
    .values({
      id,
      userId: user.id,
      title: `Chat ${existingChatCount.count + 1}`,
    })
    .returning();
  // console.timeLog('createChat', 'insertChat');

  await db
    .insert(messages)
    .values({ chatId: newChat.id, content: message, position: 1 });

  // console.timeEnd('createChat');

  // await new Promise((resolve) => setTimeout(resolve, 4_000));

  // redirect(`/chat/${newChat.id}`, RedirectType.replace);
  // });

  // refresh();
  // redirect(`/chat/${newChat.id}`, RedirectType.replace);

  // redirect(`/chat/${id}?new`);

  // refresh();
  // redirect(`/chat/${id}`);
  // redirect(`/chat/b9f2134c-0258-4eaf-8f8a-0a1b9d7afb40`);
}

export async function sleepAction() {
  await new Promise((resolve) => setTimeout(resolve, 4_000));
  redirect('/');
}
