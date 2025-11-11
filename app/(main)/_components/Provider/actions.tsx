'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { streamText } from 'ai';
import { sql } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { ClientMessage } from '../ChatLog';

export async function fetchAnswerStream(content: string) {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-3.5-turbo'),
      prompt: content,
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return stream.value;
}

export async function saveAssistantMessage(
  chatId: string,
  unsafeData: ClientMessage
) {
  const result = await db
    .insert(messages)
    .values({
      id: unsafeData.id,
      chatId,
      content: unsafeData.content,
      position: sql`COALESCE((SELECT MAX(position) FROM ${messages} WHERE ${messages.chatId} = ${chatId}), 1)`,
      role: 'assistant',
    })
    .returning();

  updateTag(`chat:${chatId}`);
  return result[0];
}
