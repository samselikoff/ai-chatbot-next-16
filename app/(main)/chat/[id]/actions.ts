'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { refresh } from 'next/cache';
import { Message } from '../../_components/MessageLog';

export async function saveMessages(newMessages: Message[]) {
  await db.insert(messages).values(newMessages);

  // updateTag(`chat:${newMessages[0].chatId}`);
  refresh();
}
