import { db } from '@/db';
import { getCurrentUser } from '@/lib/get-current-user';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className="flex">
      <Suspense>
        <Sidebar />
      </Suspense>

      <main className="grow flex justify-center">
        <h1 className="text-lg mt-20">What can I help you with today?</h1>
      </main>
    </div>
  );
}

async function Sidebar() {
  const currentUser = await getCurrentUser();

  const chats = await db.query.chats.findMany({
    where: (t, { eq }) => eq(t.userId, currentUser.id),
    orderBy: (t, { desc }) => desc(t.createdAt),
    limit: 10,
  });

  return (
    <nav className="w-60 shrink-0 h-dvh bg-gray-100 flex flex-col">
      <div className="border-b border-gray-300 flex flex-col">
        <p className="mx-5 my-3 text-sm font-semibold text-gray-700">
          Next 16 Chatbot
        </p>
      </div>

      <div className="flex flex-col overflow-y-auto grow py-2">
        {chats.map((chat) => (
          <p className="text-sm px-5 py-2" key={chat.id}>
            {chat.title}
          </p>
        ))}
      </div>
    </nav>
  );
}
