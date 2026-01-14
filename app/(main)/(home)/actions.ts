"use server";

import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import OpenAI from "openai";
import { Chat } from "../_components/MessageLog";

export async function createChat(clientChat: Chat) {
  const user = await getCurrentUser();

  const client = new OpenAI();
  const response = await client.responses.create({
    model: "gpt-3.5-turbo",
    // model: "gpt-4",
    input: [
      {
        role: "assistant",
        content:
          "Please respond with a short, few-word title for a conversation where the user's first question is provided in the next message. Don't return any punctuation, or anything other than the title as plain text.",
      },
      { role: "user", content: clientChat.messages[0].content },
    ],
  });
  const title = response.output_text ?? "New chat";

  await db
    .insert(chats)
    .values({
      id: clientChat.id,
      userId: user.id,
      title,
    })
    .returning();

  await db.insert(messages).values(clientChat.messages);

  refresh();
  redirect(`/chat/${clientChat.id}`);
}
