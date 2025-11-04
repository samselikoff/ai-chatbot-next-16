import { Suspense } from 'react';
import { OptimisticChat } from './_components/OptimisticChat';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import { ChatLog } from './_components/ChatLog';

export const unstable_prefetch = {
  mode: 'runtime',
  samples: [{}],
};

export default async function Page(props: PageProps<'/chat/[id]'>) {
  console.log('chat page');
  return (
    <Suspense fallback="loading...">
      <Content {...props} />
    </Suspense>
  );
}

async function Content(props: PageProps<'/chat/[id]'>) {
  // await new Promise((resolve) => setTimeout(resolve, 2_000));
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const isUnsavedChat = searchParams.new === '';

  // return shouldCreateChat ? <OptimisticChat id={id} /> : <ServerChat id={id} />;
  return isUnsavedChat ? <OptimisticChat id={id} /> : <ServerChat id={id} />;
}

async function ServerChat({ id }: { id: string }) {
  'use cache';

  const chat = await db.query.chats.findFirst({
    where: (t, { eq }) => eq(t.id, id),
    with: {
      messages: {
        columns: {
          id: true,
          content: true,
        },
      },
    },
    columns: {
      id: true,
      title: true,
    },
  });

  if (!chat) notFound();

  return <ChatLog chat={chat} />;
}
