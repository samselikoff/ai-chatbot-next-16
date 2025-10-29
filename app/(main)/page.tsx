import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
import { count, eq } from 'drizzle-orm';
import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import invariant from 'tiny-invariant';

export default async function Home() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}

async function createChat(formData: FormData) {
  'use server';
  const user = await stackServerApp.getUser();
  if (!user) {
    return;
  }
  const message = formData.get('message');
  invariant(typeof message === 'string');

  const [existingChatCount] = await db
    .select({ count: count() })
    .from(chats)
    .where(eq(chats.userId, user.id));

  const [newChat] = await db
    .insert(chats)
    .values({ userId: user.id, title: `Chat ${existingChatCount.count + 1}` })
    .returning();

  await db
    .insert(messages)
    .values({ chatId: newChat.id, content: message, position: 1 });

  refresh();
  redirect(`/chat/${newChat.id}`);
}

async function Content() {
  return (
    <div className="m-4">
      <div className="mt-8">
        <form action={createChat}>
          <div>
            <input
              name="message"
              type="text"
              placeholder="Enter a message..."
              className="border px-2 py-1 rounded"
              required
            />
          </div>

          <div className="mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-2 py-1 rounded"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
