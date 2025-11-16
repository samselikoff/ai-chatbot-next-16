'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import OpenAI from 'openai';
import { Message } from '../MessageLog';

export async function continueChat(userMessage: Message) {
  const existingMessages = await db.query.messages.findMany({
    where: (t, { eq }) => eq(t.chatId, userMessage.chatId),
    orderBy: (t, { asc }) => asc(t.position),
    columns: {
      role: true,
      content: true,
    },
  });

  const client = new OpenAI();

  const response = await client.responses.create({
    model: 'gpt-3.5-turbo',
    input: [
      ...existingMessages,
      { role: 'user', content: userMessage.content },
    ],
    stream: true,
  });

  return response;
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
