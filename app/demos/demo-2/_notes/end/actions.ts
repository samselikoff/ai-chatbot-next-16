'use server';

import OpenAI from 'openai';
import { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs';
import { Stream } from 'openai/streaming';

export async function getStream(prompt: string) {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: 'gpt-3.5-turbo',
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
