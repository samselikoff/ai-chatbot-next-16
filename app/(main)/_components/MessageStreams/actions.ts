'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { streamText } from 'ai';
import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
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
