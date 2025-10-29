import { db } from '@/db';
import { stackServerApp } from '@/stack/server';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ChatLink } from './ChatLink';

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

  if (!user) {
    redirect('/handler/sign-up');
  }

  const chats = await db.query.chats.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
    where: (t, { eq }) => eq(t.userId, user.id),
  });

  return (
    <>
      {chats.map((chat) => (
        <ChatLink
          key={chat.id}
          href={`/chat/${chat.id}`}
          className="mx-2 px-3 py-2 rounded-lg hover:bg-gray-200
            data-active:bg-blue-500 data-active:text-white
            text-sm text-gray-800 font-medium
          "
        >
          {chat.title}
        </ChatLink>
      ))}

      <div className="mt-auto m-4 flex justify-between gap-2 text-sm">
        <p className="truncate min-w-0">{user.displayName ?? 'Welcome!'}</p>
        <div className="shrink-0">
          <form
            action={async () => {
              'use server';
              const user = await stackServerApp.getUser();
              await user?.signOut();
              redirect('/handler/sign-up');
            }}
          >
            <button
              className="text-gray-500 hover:text-gray-900 cursor-pointer"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
