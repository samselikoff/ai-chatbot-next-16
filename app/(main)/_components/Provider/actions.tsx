'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { streamText } from 'ai';
import { sql } from 'drizzle-orm';
import { updateTag } from 'next/cache';

export async function fetchAnswerStream() {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-3.5-turbo'),
      prompt: 'why is the sky blue?',
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return stream.value;
}

export async function saveAssistantMessage(chatId: string, content: string) {
  const result = await db
    .insert(messages)
    .values({
      chatId,
      content,
      position: sql`COALESCE((SELECT MAX(position) + 1 FROM ${messages} WHERE ${messages.chatId} = ${chatId}), 0)`,
      role: 'assistant',
    })
    .returning();

  updateTag(`chat:${chatId}`);
  return result[0];
}
