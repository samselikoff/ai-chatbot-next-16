'use server';

import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
import { count, eq } from 'drizzle-orm';
import { refresh } from 'next/cache';
import { redirect, RedirectType } from 'next/navigation';
import { after } from 'next/server';
import { ClientChat } from './chat/[id]/_components/ChatLog';
import OpenAI from 'openai';

export async function createChat(unsafeChatData: ClientChat) {
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

  const [chat] = await db
    .insert(chats)
    .values({
      id: unsafeChatData.id,
      userId: user.id,
      title: `Chat ${existingChatCount.count + 1}`,
    })
    .returning();

  // console.timeLog('createChat', 'insertChat');

  await db.insert(messages).values({
    id: unsafeChatData.messages[0].id,
    chatId: chat.id,
    content: unsafeChatData.messages[0].content,
    position: 1,
    role: 'user',
  });

  redirect(`/chat/${chat.id}`);

  // return 123;

  // console.timeEnd('createChat');

  // await new Promise((resolve) => setTimeout(resolve, 4_000));

  // redirect(`/chat/${newChat.id}`, RedirectType.replace);
  // });

  // refresh();
  // redirect(`/chat/${newChat.id}`, RedirectType.replace);

  // redirect(`/chat/${id}?new`);

  // refresh();
  // redirect(`/chat/b9f2134c-0258-4eaf-8f8a-0a1b9d7afb40`);
}

export async function anotherAction() {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: 'gpt-4.1',
    input: 'tell me a short story',
    stream: true,
  });

  return response;
  // await new Promise((resolve) => setTimeout(resolve, 6_000));
  // await new Promise((resolve) => setTimeout(resolve, 4_000));
  // redirect('/');
}
