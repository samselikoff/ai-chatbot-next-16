import Spinner from "@/components/Spinner";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/get-current-user";
import { cacheTag } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";
import Client from "./client";

export const unstable_prefetch = {
  mode: "runtime",
  samples: [{}],
};

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  const chatPromise = getChat(params);

  return (
    <>
      <Suspense
        fallback={
          <div className="flex justify-center pt-20">
            <Spinner />
          </div>
        }
      >
        {chatPromise.then((chat) => (
          <Client chat={chat} />
        ))}
      </Suspense>
    </>
  );
}

async function getChat(params: PageProps<"/chat/[id]">["params"]) {
  const { id } = await params;
  const user = await getCurrentUser();

  const chat = await getChatForUser(id, user.id);

  if (!chat) {
    redirect("/", RedirectType.replace);
  }

  return chat;
}

async function getChatForUser(chatId: string, userId: string) {
  "use cache";
  cacheTag(`chat:${chatId}`);

  try {
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

    return chat ?? null;
  } catch {
    return null;
  }
}
