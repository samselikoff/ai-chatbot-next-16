import { db } from '@/db';
import { chats } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
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
  const title = formData.get('title');
  invariant(typeof title === 'string');

  const [newChat] = await db
    .insert(chats)
    .values({ userId: user.id, title })
    .returning();

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
              name="title"
              type="text"
              placeholder="New chat..."
              className="border px-2 py-1 rounded"
              required
            />
          </div>

          <div className="mt-2">
            <button
              className="bg-blue-500 text-white font-medium px-2 py-1 rounded"
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
