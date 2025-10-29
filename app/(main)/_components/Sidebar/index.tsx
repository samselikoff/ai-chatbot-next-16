import { db } from '@/db';
import { stackServerApp } from '@/stack/server';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ChatLink } from './ChatLink';
import { getCurrentUser } from '@/lib/current-user';

export async function Sidebar() {
  return (
    <nav className="w-60 h-dvh bg-gray-100 flex flex-col">
      <div className="border-b border-gray-300 flex flex-col">
        <p className="mx-5 mt-3 text-sm font-semibold text-gray-700">
          Next 16 Chatbot
        </p>
        <Link
          href="/"
          className="m-2 px-3 py-2 hover:bg-gray-200 mb-4 text-sm rounded-lg inline-flex items-center gap-1 text-gray-800"
        >
          <PencilSquareIcon className="size-4" />
          New chat
        </Link>
      </div>

      <Suspense>
        <div className="flex flex-col overflow-y-auto grow py-2">
          <Chats />
        </div>

        <div className="flex flex-col shrink-0">
          <UserInfo />
        </div>
      </Suspense>
    </nav>
  );
}

async function Chats() {
  const currentUser = await getCurrentUser();

  const chats = await db.query.chats.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
    where: (t, { eq }) => eq(t.userId, currentUser.id),
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
    </>
  );
}

async function UserInfo() {
  const currentUser = await getCurrentUser();

  return (
    <div className="p-4 flex justify-between gap-2 text-sm border-t border-gray-300">
      <p className="truncate min-w-0">
        {currentUser.displayName ?? 'Welcome!'}
      </p>
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
  );
}
