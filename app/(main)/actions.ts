'use server';

import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
import { count, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ClientChat, ClientMessage, Message } from './_components/ChatLog';
import { updateTag } from 'next/cache';

// export async function createChat(unsafeChatData: ClientChat) {
//   const user = await stackServerApp.getUser();

//   if (!user) {
//     return;
//   }

//   const [existingChatCount] = await db
//     .select({ count: count() })
//     .from(chats)
//     .where(eq(chats.userId, user.id));

//   const [chat] = await db
//     .insert(chats)
//     .values({
//       id: unsafeChatData.id,
//       userId: user.id,
//       title: `Chat ${existingChatCount.count + 1}`,
//     })
//     .returning();

//   await db.insert(messages).values({
//     id: unsafeChatData.messages[0].id,
//     chatId: chat.id,
//     content: unsafeChatData.messages[0].content,
//     position: 1,
//     role: 'user',
//   });

//   redirect(`/chat/${chat.id}`);
// }

export async function createChat(clientChat: ClientChat) {
  // TODO: Validate clientChat argument

  const user = await stackServerApp.getUser();

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

  redirect(`/chat/${clientChat.id}`);
}

export async function completeMessage(
  id: string,
  content: string,
  chatId: string
) {
  await db
    .update(messages)
    .set({ content, status: 'DONE' })
    .where(eq(messages.id, id));

  updateTag(`chat:${chatId}`);
}
