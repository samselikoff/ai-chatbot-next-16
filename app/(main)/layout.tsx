import { MessageStreams } from "./_components/MessageStreams";
import OptimisticChatsProvider from "./_components/OptimisticChatsProvider";
import { Sidebar } from "./_components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OptimisticChatsProvider>
      <MessageStreams>
        <div className="flex w-full">
          <Sidebar />

          <main className="grow">{children}</main>
        </div>
      </MessageStreams>
    </OptimisticChatsProvider>
  );
}
