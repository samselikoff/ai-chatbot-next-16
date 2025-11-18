export default async function Page() {
  return (
    <div className="flex">
      <nav className="w-40 shrink-0 h-dvh bg-gray-100 flex flex-col">
        <div className="border-b border-gray-300 flex flex-col">
          <p className="mx-5 my-3 text-sm font-semibold text-gray-700">
            Next 16 Chatbot
          </p>
        </div>

        <div className="flex flex-col overflow-y-auto grow py-2">
          {/* TODO: Show chats */}
        </div>
      </nav>

      <main className="grow flex justify-center">
        <h1 className="text-lg mt-20">What can I help you with today?</h1>
      </main>
    </div>
  );
}
