import { db } from '@/db';
import { unsealCookie } from '@/lib/session';
import { cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Client from './_client';

export const unstable_prefetch = {
  mode: 'runtime',
  samples: [{}],
};

export default async function Page({ params }: PageProps<'/chat/[id]'>) {
  const chatPromise = getChat(params);

  return <Client chatPromise={chatPromise} />;
}

async function getChat(params: PageProps<'/chat/[id]'>['params']) {
  // Access runtime data
  const { id } = await params;
  const appSessionCookie = (await cookies()).get('app_session')?.value;

  return getChatWithSessionCookie(id, appSessionCookie ?? '');
}

async function getChatWithSessionCookie(chatId: string, sessionCookie: string) {
  'use cache';
  cacheTag(`chat:${chatId}`);

  // Can't be done at runtime - must be done inside "use cache".
  const { userId } = await unsealCookie(sessionCookie);

  if (!userId) {
    notFound();
  }

  const chat = await db.query.chats.findFirst({
    where: (t, { and, eq }) => and(eq(t.id, chatId), eq(t.userId, userId)),
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

  if (!chat) {
    notFound();
  }

  return chat;
}
