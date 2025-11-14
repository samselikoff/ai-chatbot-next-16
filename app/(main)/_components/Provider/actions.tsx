'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { streamText } from 'ai';
import { sql } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { ClientMessage } from '../ChatLog';
import OpenAI from 'openai';

export async function fetchAnswerStream(content: string) {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-3.5-turbo'),
      prompt: content,
      // prompt: 'why is the sky blue?',
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return stream.value;
}

/*
  Open AI SDK version. Blocks in dev but not prod.
*/
// export async function fetchAnswerStream(content: string) {
//   const client = new OpenAI();

//   const response = await client.responses.create({
//     model: 'gpt-3.5-turbo',
//     input: 'why is the sky blue?',
//     stream: true,
//   });

//   return response;
// }

/*
  Open AI API version. Also blocks in dev.
*/
// export async function fetchAnswerStream(content: string) {
// const res = await fetch('https://api.openai.com/v1/responses', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: 'gpt-3.5-turbo',
//       input: 'why is the sky blue?',
//       stream: true,
//     }),
//   });

//   return res.body;
// }

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
      position: unsafeData.position,
      role: 'assistant',
    })
    .returning();

  updateTag(`chat:${chatId}`);
  return result[0];
}
