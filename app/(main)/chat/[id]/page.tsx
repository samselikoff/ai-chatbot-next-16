import { db } from '@/db';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Params = PageProps<'/chat/[id]'>['params'];

export const unstable_prefetch = {
  mode: 'runtime',
  samples: [{}],
};

export default async function Page({ params }: { params: Params }) {
  return (
    <Suspense>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Params }) {
  const { id } = await params;
  const chat = await getChat(id);

  return (
    <div className="p-4">
      <p>{chat?.title}</p>
    </div>
  );
}

async function getChat(id: string) {
  'use cache';
  const chat = await db.query.chats.findFirst({
    where: (t, { eq }) => eq(t.id, id),
  });

  if (!chat) notFound();

  return chat;
}
