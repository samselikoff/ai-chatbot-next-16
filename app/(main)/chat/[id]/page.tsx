import { db } from '@/db';
import { getCurrentUser } from '@/lib/get-current-user';
import { notFound } from 'next/navigation';
import Client from './client';

// export const unstable_prefetch = {
//   mode: 'runtime',
//   samples: [{}],
// };

export default async function Page({ params }: PageProps<'/chat/[id]'>) {
  const chatPromise = params.then((p) => getChat(p.id));

  return <Client chatPromise={chatPromise} />;
}

async function getChat(chatId: string) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  // Simulate delay
  // await new Promise((resolve) => setTimeout(resolve, 250));
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

  if (!chat) {
    notFound();
  }

  return chat;
}
