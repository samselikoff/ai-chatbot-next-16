import { Sidebar } from './_components/Sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="grow">{children}</main>
    </div>
  );
}
