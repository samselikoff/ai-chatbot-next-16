import { db } from '@/db';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MessageBox } from '../../_components/MessageBox';
import { ChatLog } from '../../_components/ChatLog';
import { stackServerApp } from '@/stack/server';
import { cacheTag } from 'next/cache';

export const unstable_prefetch = {
  mode: 'runtime',
  samples: [{}],
};

export default async function Page(props: PageProps<'/chat/[id]'>) {
  return (
    <div className="h-dvh flex flex-col max-w-2xl mx-auto px-4">
      <div className="grow">
        <Suspense fallback="loading...">
          <Content {...props} />
        </Suspense>
      </div>

      <MessageBox
        submitAction={async () => {
          'use server';
          //
        }}
      />
    </div>
  );
}

async function Content(props: PageProps<'/chat/[id]'>) {
  const { id } = await props.params;

  return <ServerChat id={id} />;
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
        },
      },
    },
    columns: {
      id: true,
      title: true,
    },
  });

  if (!chat) notFound();
  console.log(chat);

  return <ChatLog chat={chat} />;
}
