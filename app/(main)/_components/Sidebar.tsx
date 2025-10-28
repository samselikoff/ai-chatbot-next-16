import { db } from '@/db';
import { stackServerApp } from '@/stack/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function Sidebar() {
  return (
    <nav className="w-40 min-h-dvh bg-gray-100 flex flex-col">
      <Link href="/" className="p-4 hover:bg-gray-200">
        Home
      </Link>

      <Suspense>
        <Content />
      </Suspense>
    </nav>
  );
}

async function Content() {
  const user = await stackServerApp.getUser();

  // if (!user) {
  //   notFound();
  // }

  const chats = await db.query.chats.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
  });

  return (
    <>
      {chats.map((chat) => (
        <Link
          href={`/chat/${chat.id}`}
          key={chat.id}
          className="p-4 hover:bg-gray-200"
        >
          {chat.title}
        </Link>
      ))}
    </>
  );
}
