import { db } from '@/db';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MessageBox } from '../../_components/MessageBox';
import { ChatLog } from '../../_components/ChatLog';
import { stackServerApp } from '@/stack/server';
import { cacheTag } from 'next/cache';
import { Something } from './something';

export const unstable_prefetch = {
  mode: 'runtime',
  samples: [{}],
};

export default async function Page({ params }: PageProps<'/chat/[id]'>) {
  return (
    <div className="h-dvh flex flex-col max-w-2xl mx-auto px-4">
      <Suspense fallback="loading...">
        {params.then(({ id }) => (
          <ServerChat id={id} />
        ))}
      </Suspense>
    </div>
  );
}

async function ServerChat({ id }: { id: string }) {
  'use cache: private';
  cacheTag(`chat:${id}`);

  const user = await stackServerApp.getUser();

  if (!user) {
    return;
  }

  const chat = await db.query.chats.findFirst({
    where: (t, { and, eq }) => and(eq(t.id, id), eq(t.userId, user.id)),
    with: {
      messages: {
        columns: {
          id: true,
          content: true,
          role: true,
          createdAt: true,
          position: true,
          status: true,
        },
        orderBy: (t, { asc }) => asc(t.position),
      },
    },
    columns: {
      id: true,
      title: true,
    },
  });

  if (!chat) notFound();

  // console.log(chat.messages.map((m) => m.position));

  return (
    <>
      <div className="grow">
        <ChatLog chat={chat} />
      </div>

      <Something chatId={chat.id} />
    </>
  );
}
