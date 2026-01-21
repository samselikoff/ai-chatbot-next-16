import { Dialog } from "@base-ui/react/dialog";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";

export function WhatsThis() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex cursor-pointer border border-sky-200 bg-sky-100 px-1.5 py-0.5 text-sm font-medium text-sky-700 hover:bg-sky-200">
        {`What is this app?`}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 max-h-[calc(100dvh-3rem)] w-[650px] max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-gray-50 p-6 text-gray-900 lg:-mt-8">
          <Dialog.Title className="-mt-1.5 mb-1 text-xl font-medium">
            {`What's this?`}
          </Dialog.Title>

          <div className="mt-4 space-y-4 text-base text-gray-600">
            <Dialog.Description>
              This app is a demo of the new <strong>Instant</strong> feature in
              Next 16.
            </Dialog.Description>

            <hr className="border-gray-300" />

            <p>
              Today, Links in Next prefetch the static prerendered content of
              their target pages. For dynamic apps (like this chatbot), that
              static content tends to only be some minimal loading UI.
            </p>

            <p>
              With Instant, routes can opt into <em>runtime prefetching</em>,
              allowing Links to prefetch fully rendered pages, even if those
              pages include dynamic user-specific data.
            </p>

            <p>
              {`This brings instant client navigations to server-rendered pages in
              your Next app. It's the snappiness of an SPA, without any
              client-side data fetching or API routes.`}
            </p>

            <hr className="border-gray-300" />

            <p>Try using the app and see how it feels.</p>
            <p>
              Creating new chats, sending messages, and navigating to existing
              chats should feel instant.
            </p>
          </div>

          <div className="my-8 rounded-xl bg-red-100 p-4 text-sm text-red-700">
            <p className="inline-flex items-center gap-1">
              <ExclamationCircleIcon className="size-4" />
              <strong className="font-semibold text-red-800">
                Hitlist for showing off Instant
              </strong>
            </p>

            <div className="mt-4 space-y-4">
              <p>
                For this app to be a compelling demo of App Router (i.e. parity
                with an SPA equivalent), there are some outstanding
                bugs/features in Cache Components that need to be shipped.
              </p>

              <p>Blocking issues:</p>

              <ul className="-mt-2 list-disc space-y-2 pl-4">
                <li>
                  <strong>Actions block navigations.</strong> Try creating a new
                  chat, then immediately navigating to an existing chat. The nav
                  will be blocked until the initial empty chat is saved to the
                  database.
                </li>
                <li>
                  <strong>Instant config option.</strong> The demo currently
                  uses unstable_prefetch to demonstrate instant navigations to
                  existing chats. This feature needs to be stabilized before
                  showing off the demo.
                </li>
              </ul>

              <p>Other issues:</p>

              <ul className="-mt-2 list-disc space-y-2 pl-4">
                <li>
                  <strong>Instant actions.</strong> Creating a new chat
                  doesn&apos;t navigate to the new URL until the createChat
                  action completes. Instant actions will allow forms with
                  actions to optimistically render the upcoming page
                  immediately.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex justify-end gap-4">
            <Dialog.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
