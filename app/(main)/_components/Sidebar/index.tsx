import { db } from '@/db';
import { stackServerApp } from '@/stack/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ChatLink } from './SidebarLink';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
// import { PencilSquareIcon } from '@heroicons/react/24/outline';

export async function Sidebar() {
  return (
    <nav className="w-60 h-dvh bg-gray-100 flex flex-col overflow-y-auto">
      <Link
        href="/"
        className="m-2 px-3 py-2 hover:bg-gray-200 mb-4 text-sm rounded-lg inline-flex items-center gap-1 text-gray-800"
      >
        <PencilSquareIcon className="size-4" />
        New chat
      </Link>

      <Suspense>
        <Content />
      </Suspense>
    </nav>
  );
}

async function Content() {
  const user = await stackServerApp.getUser();
  // await new Promise((resolve) => setTimeout(resolve, 2_000));

  // if (!user) {
  //   notFound();
  // }

  const chats = await db.query.chats.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
  });

  return (
    <>
      {chats.map((chat) => (
        <ChatLink
          key={chat.id}
          href={`/chat/${chat.id}`}
          chatId={chat.id}
          className="mx-2 px-3 py-2 rounded-lg hover:bg-gray-200 data-active:bg-blue-500 data-active:text-white text-sm text-gray-800 font-medium"
        >
          {chat.title}
        </ChatLink>
      ))}
    </>
  );
}
