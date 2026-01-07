import { db } from '@/db';
import { getCurrentUser } from '@/lib/get-current-user';
import { getSession } from '@/lib/session';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { Suspense } from 'react';
import { ChatLink } from './ChatLink';
import { redirect } from 'next/navigation';

export async function Sidebar() {
  return (
    <nav className="w-60 shrink-0 h-dvh bg-gray-100 flex flex-col border-r border-gray-200">
      <div className="flex flex-col">
        <p className="mx-5 mt-3 text-sm font-semibold text-gray-700">
          Next 16 Chatbot
        </p>
        <Link
          href="/"
          className="m-2 px-3 py-2 hover:bg-gray-200 mb-4 text-sm rounded-lg inline-flex items-center gap-2 text-gray-800"
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
  if (!currentUser) {
    return null;
  }

  const chats = await db.query.chats.findMany({
    orderBy: (t, { desc }) => desc(t.createdAt),
    where: (t, { eq }) => eq(t.userId, currentUser.id),
  });

  return (
    <>
      {chats.length > 0 && (
        <p className="mx-2 px-3 py-2 text-sm text-gray-500">Your chats</p>
      )}

      {chats.map((chat) => (
        <ChatLink
          key={chat.id}
          href={`/chat/${chat.id}`}
          className="mx-2 px-3 py-2 rounded-lg hover:bg-gray-200
            data-active:bg-gray-300
            text-sm text-gray-900
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
      <p className="truncate min-w-0">{currentUser?.email ?? 'nope'}</p>
      <div className="shrink-0">
        <form
          action={async () => {
            'use server';
            const session = await getSession();
            session.destroy();
            await session.save();

            redirect('/sign-in');
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
