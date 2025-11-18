'use server';

import { db } from '@/db';
import { demoMessages } from '@/db/schema';
import { refresh } from 'next/cache';
import OpenAI from 'openai';
import { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs';
import { Stream } from 'openai/streaming';

export type DemoMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
};

export async function saveMessages(messages: DemoMessage[]) {
  await new Promise((resolve) => setTimeout(resolve, 1_000));

  // throw new Error('💥');
  await db.insert(demoMessages).values(messages);

  refresh();
}

export async function getStream(prompt: string) {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: 'gpt-5',
    input: [{ role: 'user', content: prompt }],
    stream: true,
  });

  return streamText(response);
}

async function* streamText(stream: Stream<ResponseStreamEvent>) {
  for await (const chunk of stream) {
    if (chunk.type === 'response.output_text.delta') {
      yield chunk.delta;
    }
  }
}
