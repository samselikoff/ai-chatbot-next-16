export type Chat = { id: string; title: string | null; messages: Message[] };
export type Message = { id: string; content: string };

export function ChatLog({ chat }: { chat: Chat }) {
  return (
    <div className="p-4">
      <p className="text-center font-semibold">{chat?.title}</p>

      <div className="max-w-lg mx-auto mt-8">
        {chat.messages.map((message) => (
          <p className="text-right" key={message.id}>
            {message.content}
          </p>
        ))}
      </div>
    </div>
  );
}
