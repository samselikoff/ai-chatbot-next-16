import { Provider } from './_components/Provider';
import { Sidebar } from './_components/Sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <div className="flex w-full">
        <Sidebar />

        <main className="grow">{children}</main>
      </div>
    </Provider>
  );
}
