"use client";

import Spinner from "@/components/Spinner";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { useRef, useState, useTransition } from "react";
import { deleteChat } from "./actions";

export function ChatLinkMenu({
  chatId,
  chatTitle,
}: {
  chatId: string;
  chatTitle: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Menu.Root>
        <Menu.Trigger className="flex size-8 cursor-pointer items-center justify-center rounded text-gray-400 opacity-0 group-hover:opacity-100 group-has-data-popup-open:text-gray-800 group-has-data-popup-open:opacity-100 hover:text-gray-800">
          <EllipsisVerticalIcon className="size-4" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner className="z-50" align="start" sideOffset={4}>
            <Menu.Popup className="min-w-32 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg outline-none">
              <Menu.Item
                onClick={() => setDialogOpen(true)}
                className="cursor-pointer rounded px-3 py-1.5 text-sm text-gray-700 outline-none select-none data-highlighted:bg-gray-100"
              >
                Delete...
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />

          <Dialog.Popup
            initialFocus={deleteRef}
            className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline-1 outline-gray-200 transition-all duration-150 dark:outline-gray-300"
          >
            <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
              Delete chat?
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-base text-gray-600">
              This will delete <strong>{chatTitle}</strong>.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <Dialog.Close className="flex h-10 items-center justify-center rounded-full border border-gray-300 px-3.5 text-base font-medium text-gray-900 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                Cancel
              </Dialog.Close>
              <button
                ref={deleteRef}
                className="rounded-full bg-red-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-2 focus:outline-offset-2 focus:outline-red-500"
                onClick={() => {
                  startTransition(async () => {
                    await deleteChat(
                      chatId,
                      window.location.pathname === `/chat/${chatId}`,
                    );
                    setDialogOpen(false);
                  });
                }}
              >
                <Spinner loading={isPending}>Delete</Spinner>
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
