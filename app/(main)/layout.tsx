import { MessageStreams } from './_components/MessageStreams';
import { Sidebar } from './_components/Sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MessageStreams>
      <div className="flex w-full">
        <Sidebar />

        <main className="grow">{children}</main>
      </div>
    </MessageStreams>
  );
}
