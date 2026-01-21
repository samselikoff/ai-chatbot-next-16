import { NavLink } from "@/components/NavLink";
import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { Dialog } from "@base-ui/react/dialog";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { and, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { logout } from "./actions";
import { ChatLinkMenu } from "./ChatLinkMenu";
import { HasChats } from "./HasChats";
import { OptimisticChats } from "./OptimisticChats";
import { Streaming } from "./Streaming";

export async function Sidebar({
  closeDialogOnNavigate = false,
}: {
  closeDialogOnNavigate?: boolean;
}) {
  return (
    <nav className="flex h-dvh w-full shrink-0 flex-col border-gray-200 bg-white md:w-60 md:border-r md:bg-gray-100">
      <div className="flex flex-col">
        <div className="mt-3 mr-3 ml-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Next 16 Chatbot</p>
        </div>

        <div className="m-2 mb-4">
          <MaybeCloseDialog
            shouldClose={closeDialogOnNavigate}
            className="block w-full text-left"
          >
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-200"
            >
              <PencilSquareIcon className="size-4" />
              New chat
            </Link>
          </MaybeCloseDialog>
        </div>
      </div>

      <Suspense>
        <div className="flex grow flex-col overflow-y-auto py-2">
          <Chats closeDialogOnNavigate={closeDialogOnNavigate} />
        </div>
        <div className="flex shrink-0 flex-col">
          <UserInfo closeDialogOnNavigate={closeDialogOnNavigate} />
        </div>
      </Suspense>
    </nav>
  );
}

async function Chats({
  closeDialogOnNavigate,
}: {
  closeDialogOnNavigate: boolean;
}) {
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
      <HasChats hasServerChats={sidebarChats.length > 0}>
        <p className="mx-2 px-3 py-2 text-sm text-gray-500">Your chats</p>
      </HasChats>

      <OptimisticChats />

      {sidebarChats.map((chat) => (
        <div key={chat.id} className="group relative mx-2">
          <MaybeCloseDialog
            shouldClose={closeDialogOnNavigate}
            className="block w-full text-left"
          >
            <NavLink
              href={`/chat/${chat.id}`}
              className="block w-full min-w-0 items-center justify-between truncate rounded-lg py-2 pr-6 pl-3 text-sm text-gray-900 group-hover:bg-gray-200 group-has-data-popup-open:bg-gray-200 data-active:bg-gray-300"
            >
              {chat.title}
            </NavLink>
          </MaybeCloseDialog>

          <div className="absolute inset-y-0 right-0 flex items-center">
            <Streaming isStreaming={chat.isStreaming} chatId={chat.id}>
              <ChatLinkMenu chatId={chat.id} chatTitle={chat.title ?? ""} />
            </Streaming>
          </div>
        </div>
      ))}
    </>
  );
}

function MaybeCloseDialog({
  shouldClose,
  children,
  className = "",
}: {
  shouldClose: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (shouldClose) {
    return <Dialog.Close className={className}>{children}</Dialog.Close>;
  }

  return children;
}

async function UserInfo({
  closeDialogOnNavigate,
}: {
  closeDialogOnNavigate: boolean;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex justify-between gap-2 border-t border-gray-300 p-4 text-sm">
      <p className="min-w-0 truncate">{currentUser?.email ?? "nope"}</p>
      <div className="shrink-0">
        <form action={logout}>
          {closeDialogOnNavigate ? (
            <Dialog.Close
              className="cursor-pointer text-gray-500 hover:text-gray-900"
              type="submit"
            >
              Sign out
            </Dialog.Close>
          ) : (
            <button
              className="cursor-pointer text-gray-500 hover:text-gray-900"
              type="submit"
            >
              Sign out
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
