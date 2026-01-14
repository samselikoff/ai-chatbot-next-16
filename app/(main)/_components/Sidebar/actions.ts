"use server";

import { db } from "@/db";
import { chats } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { eq, and } from "drizzle-orm";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteChat(chatId: string, shouldRedirect: boolean) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  await db
    .delete(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, user.id)));

  refresh();

  if (shouldRedirect) {
    redirect("/");
  }
}
