## Autogenerate chat title

```tsx
export async function generateChatTitle(firstUserMesage: Message) {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: 'gpt-3.5-turbo',
    input: [
      {
        role: 'assistant',
        content:
          'You will be given the first user prompt for a new conversation. Create a short title (3-5 words) for the conversation based on the prompt. Return just the title with no additional labels or punctuation.',
      },
      { role: 'user', content: firstUserMesage.content },
    ],
  });

  const res = await db
    .update(chats)
    .set({ title: response.output_text })
    .where(eq(chats.id, firstUserMesage.chatId))
    .returning();

  console.log(res);
}
```
