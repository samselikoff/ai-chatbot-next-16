'use server';

import { db } from '@/db';
import { demoMessages } from '@/db/schema';
import { refresh } from 'next/cache';

export type DemoMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
};

export async function saveMessages(messages: DemoMessage[]) {
  await new Promise((resolve) => setTimeout(resolve, 1_000));
  throw new Error('💥');
  await db.insert(demoMessages).values(messages);

  refresh();
}
