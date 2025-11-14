'use server';

import { db } from '@/db';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { streamText } from 'ai';
import { ClientMessage } from '../../_components/ChatLog';
import { messages } from '@/db/schema';
import { updateTag } from 'next/cache';

export async function saveMessage(chatId: string, userMessage: ClientMessage) {
  await db
    .insert(messages)
    .values({
      id: userMessage.id,
      chatId,
      content: userMessage.content,
      position: userMessage.position,
      role: 'user',
    })
    .returning();

  updateTag(`chat:${chatId}`);
  // return result[0];
}

export async function continueChat(chatId: string, newMessage: ClientMessage) {
  const existingMessages = await db.query.messages.findMany({
    where: (t, { and, eq }) => and(eq(t.chatId, chatId), eq(t.status, 'DONE')),
    orderBy: (t, { asc }) => asc(t.position),
    columns: {
      role: true,
      content: true,
    },
  });

  console.log(existingMessages);
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-3.5-turbo'),
      prompt: [
        ...existingMessages,
        { role: 'user', content: newMessage.content },
      ],
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return stream.value;
}
