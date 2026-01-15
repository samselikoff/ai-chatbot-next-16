import { Dialog } from "@base-ui/react/dialog";
import { Bars3BottomLeftIcon } from "@heroicons/react/16/solid";
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
        <div className="flex min-h-dvh w-full flex-col md:flex-row">
          <header className="sticky top-0 bg-white px-4 py-3 shadow-[0_1px_0_0_rgba(0,0,0,.05)] md:hidden">
            <Dialog.Root>
              <Dialog.Trigger className="inline-flex size-9 items-center justify-center">
                <Bars3BottomLeftIcon className="size-6 text-gray-400" />
              </Dialog.Trigger>

              <Dialog.Portal className="md:hidden">
                <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/20 transition-opacity ease-[cubic-bezier(0.36,0.66,0.04,1)] data-ending-style:opacity-0 data-ending-style:duration-450 data-starting-style:opacity-0 data-starting-style:duration-400" />
                <Dialog.Popup className="fixed inset-y-0 left-0 max-w-[calc(100vw-3rem)] shadow transition ease-[cubic-bezier(0.36,0.66,0.04,1)] data-ending-style:-translate-x-full data-ending-style:duration-450 data-starting-style:-translate-x-full data-starting-style:duration-400">
                  <Sidebar closeDialogOnNavigate />
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </header>

          <div className="max-md:hidden">
            <Sidebar />
          </div>

          <main className="flex grow flex-col">{children}</main>
        </div>
      </MessageStreams>
    </OptimisticChatsProvider>
  );
}
