import Spinner from "@/components/Spinner";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/get-current-user";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Client from "./client";

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center pt-20">
          <Spinner />
        </div>
      }
    >
      {params.then((p) => (
        <Content chatId={p.id} />
      ))}
    </Suspense>
  );
}

async function Content({ chatId }: { chatId: string }) {
  const currentUser = await getCurrentUser();
  const chat = await db.query.chats.findFirst({
    where: (t, { and, eq }) =>
      and(eq(t.id, chatId), eq(t.userId, currentUser.id)),
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

  return <Client chat={chat} />;
}
