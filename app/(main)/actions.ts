'use server';

import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { streamText } from 'ai';
import { count, eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { Chat, Message } from './_components/ChatLog';

export async function createChat(clientChat: Chat) {
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

export async function saveMessages(newMessages: Message[]) {
  await db.insert(messages).values(newMessages);

  updateTag(`chat:${newMessages[0].chatId}`);
}

export async function continueChat(userMessage: Message) {
  const existingMessages = await db.query.messages.findMany({
    where: (t, { eq }) => eq(t.chatId, userMessage.chatId),
    orderBy: (t, { asc }) => asc(t.position),
    columns: {
      role: true,
      content: true,
    },
  });

  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = streamText({
      // model: openai('gpt-5'),
      model: openai('gpt-3.5-turbo'),
      prompt: [
        ...existingMessages,
        { role: 'user', content: userMessage.content },
      ],
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return stream.value;
}

export async function completeMessage(
  assistantMessage: Message,
  content: string
) {
  await db
    .update(messages)
    .set({ content, status: 'DONE' })
    .where(eq(messages.id, assistantMessage.id));

  updateTag(`chat:${assistantMessage.chatId}`);
}
