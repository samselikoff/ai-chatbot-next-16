import { db } from '@/db';
import { stackServerApp } from '@/stack/server';
import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Spinner from '../../_components/Spinner';
import { Content } from './content';

export const unstable_prefetch = {
  mode: 'runtime',
  samples: [{}],
};

async function getChat(chatId: string) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return;
  }

  const chat = await db.query.chats.findFirst({
    where: (t, { and, eq }) => and(eq(t.id, chatId), eq(t.userId, user.id)),
    with: {
      messages: {
        columns: {
          id: true,
          content: true,
          chatId: true,
          role: true,
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
}

export default async function Page({ params }: PageProps<'/chat/[id]'>) {
  const chatPromise = params.then((p) => getChat(p.id));

  return (
    <div className="h-dvh flex flex-col">
      {/* <Suspense>
        {chatPromise.then(chat => (
          <ChatLog chat={chat} />
        ))}
      </Suspense>

      <MessageBox /> */}

      <Suspense
        fallback={
          <div className="pt-20 flex justify-center">
            <Spinner />
          </div>
        }
      >
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
          chatId: true,
          role: true,
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

  return <Content chat={chat} />;
}
