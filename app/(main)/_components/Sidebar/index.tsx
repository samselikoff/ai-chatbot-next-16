import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { getCurrentUser } from '@/lib/get-current-user';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { and, desc, eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { Dots } from '../Dots';
import { ChatLink } from './ChatLink';

export async function Sidebar() {
  return (
    <nav className="w-60 shrink-0 h-dvh bg-gray-100 flex flex-col">
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

  const sidebarChats = await db
    .select({
      id: chats.id,
      title: chats.title,
      isStreaming: sql<boolean>`COALESCE(COUNT(${messages.id}) > 0, false)`.as(
        'is_streaming'
      ),
    })
    .from(chats)
    .leftJoin(
      messages,
      and(eq(messages.chatId, chats.id), eq(messages.status, 'INIT'))
    )
    .where(eq(chats.userId, currentUser.id))
    .groupBy(chats.id, chats.title)
    .orderBy(desc(chats.createdAt));

  return (
    <>
      {sidebarChats.map((chat) => (
        <ChatLink
          key={chat.id}
          href={`/chat/${chat.id}`}
          className="inline-flex items-center mx-2 px-3 py-2 rounded-lg hover:bg-gray-200 data-active:bg-gray-300 text-sm text-gray-900"
        >
          {chat.title}

          {chat.isStreaming && (
            <ViewTransition>
              <span className="ml-auto">
                <Dots />
              </span>
            </ViewTransition>
          )}
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
            const currentUser = await getCurrentUser();
            await currentUser.signOut();
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
