import { db } from '@/db';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({ params }: PageProps<'/chat/[id]'>) {
  return (
    <Suspense>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<'/chat/[id]'>, 'params'>) {
  const { id } = await params;
  const chat = await db.query.chats.findFirst({
    where: (t, { eq }) => eq(t.id, id),
  });

  if (!chat) notFound();

  return (
    <div className="p-4">
      <p>{chat?.title}</p>
    </div>
  );
}
