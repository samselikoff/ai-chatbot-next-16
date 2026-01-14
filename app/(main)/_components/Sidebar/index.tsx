import { Dots } from "@/components/Dots";
import { NavLink } from "@/components/NavLink";
import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { getSession } from "@/lib/session";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { and, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChatLinkMenu } from "./ChatLinkMenu";

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
        <div key={chat.id} className="group relative mx-2">
          <NavLink
            href={`/chat/${chat.id}`}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-900 group-hover:bg-gray-200 group-has-data-popup-open:bg-gray-200 data-active:bg-gray-300"
          >
            {chat.title}
          </NavLink>

          <div className="absolute inset-y-0 right-0 flex items-center">
            {chat.isStreaming ? (
              <span className="mr-2 inline-flex items-center">
                <Dots />
              </span>
            ) : (
              <ChatLinkMenu chatId={chat.id} chatTitle={chat.title ?? ""} />
            )}
          </div>
        </div>
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
