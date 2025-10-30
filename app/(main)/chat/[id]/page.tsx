import { Suspense } from 'react';
import { Something } from './Something';
import { db } from '@/db';
import { notFound } from 'next/navigation';

export const unstable_prefetch = {
  mode: 'runtime',
  samples: [{}],
};

export default async function Page(props: PageProps<'/chat/[id]'>) {
  return (
    <Suspense fallback="loading...">
      <Content {...props} />
    </Suspense>
  );
}

async function Content(props: PageProps<'/chat/[id]'>) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;

  return searchParams.new === '' ? (
    <Something id={id} />
  ) : (
    <ServerChat id={id} />
  );
}

async function ServerChat({ id }: { id: string }) {
  'use cache';

  const chat = await db.query.chats.findFirst({
    where: (t, { eq }) => eq(t.id, id),
    with: {
      messages: true,
    },
  });

  if (!chat) notFound();

  return (
    <div className="p-4">
      <p className="text-center font-semibold">{chat?.title}</p>

      <div className="max-w-lg mx-auto mt-8">
        {chat.messages.map((message) => (
          <p className="text-right" key={message.id}>
            {message.content}
          </p>
        ))}
      </div>
    </div>
  );
}
