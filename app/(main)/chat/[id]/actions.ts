'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { updateTag } from 'next/cache';
import { Message } from '../../_components/MessageLog';

export async function saveMessages(newMessages: Message[]) {
  await db.insert(messages).values(newMessages);

  updateTag(`chat:${newMessages[0].chatId}`);
}
