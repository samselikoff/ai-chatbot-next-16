import { db } from '@/db';
import { getCurrentUser } from '@/lib/get-current-user';
import { notFound } from 'next/navigation';
import Client from './client';

// export const unstable_prefetch = {
//   mode: 'runtime',
//   samples: [{}],
// };

export default async function Page(props: PageProps<'/chat/[id]'>) {
  const chatPromise = verifyUserAndGetChat(props);

  return <Client chatPromise={chatPromise} />;
}

async function verifyUserAndGetChat(props: PageProps<'/chat/[id]'>) {
  const user = await getCurrentUser();
  const { id } = await props.params;

  return getChat(id, user.id);
}

async function getChat(chatId: string, userId: string) {
  // Simulate delay
  // await new Promise((resolve) => setTimeout(resolve, 250));

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
