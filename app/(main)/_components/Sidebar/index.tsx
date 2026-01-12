import { db } from "@/db";
import { getCurrentUser } from "@/lib/get-current-user";
import { getSession } from "@/lib/session";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { Suspense } from "react";
import { ChatLink } from "./ChatLink";
import { redirect } from "next/navigation";
import { chats, messages } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { Dots } from "@/components/Dots";

export async function Sidebar() {
  return (
    <nav className="flex h-dvh w-60 shrink-0 flex-col border-r border-gray-200 bg-gray-100">
      <div className="flex flex-col">
        <p className="mx-5 mt-3 text-sm font-semibold text-gray-700">
          Next 16 Chatbot
        </p>
        <Link
          href="/"
          className="m-2 mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-200"
        >
          <PencilSquareIcon className="size-4" />
          New chat
        </Link>
      </div>

      <Suspense>
        <div className="flex grow flex-col overflow-y-auto py-2">
          <Chats />
        </div>
        <div className="flex shrink-0 flex-col">
          <UserInfo />
        </div>
      </Suspense>
    </nav>
  );
}

async function Chats() {
  const currentUser = await getCurrentUser();
  const sidebarChats = await db
    .select({
      id: chats.id,
      title: chats.title,
      isStreaming: sql<boolean>`COALESCE(COUNT(${messages.id}) > 0, false)`.as(
        "is_streaming",
      ),
    })
    .from(chats)
    .leftJoin(
      messages,
      and(eq(messages.chatId, chats.id), eq(messages.status, "INIT")),
    )
    .where(eq(chats.userId, currentUser.id))
    .groupBy(chats.id, chats.title)
    .orderBy(desc(chats.createdAt));

  return (
    <>
      {sidebarChats.length > 0 && (
        <p className="mx-2 px-3 py-2 text-sm text-gray-500">Your chats</p>
      )}

      {sidebarChats.map((chat) => (
        <ChatLink
          key={chat.id}
          href={`/chat/${chat.id}`}
          className="mx-2 inline-flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-900 hover:bg-gray-200 data-active:bg-gray-300"
        >
          {chat.title}

          {chat.isStreaming && <Dots />}
        </ChatLink>
      ))}
    </>
  );
}

async function UserInfo() {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex justify-between gap-2 border-t border-gray-300 p-4 text-sm">
      <p className="min-w-0 truncate">{currentUser?.email ?? "nope"}</p>
      <div className="shrink-0">
        <form
          action={async () => {
            "use server";
            const session = await getSession();
            session.destroy();
            await session.save();

            redirect("/sign-in");
          }}
        >
          <button
            className="cursor-pointer text-gray-500 hover:text-gray-900"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
