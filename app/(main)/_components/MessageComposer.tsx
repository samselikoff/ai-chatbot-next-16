"use client";

import { ArrowUpIcon } from "@heroicons/react/16/solid";
import { useLayoutEffect, useRef, useTransition } from "react";
import invariant from "tiny-invariant";

export function MessageComposer({
  disabled,
  submitAction,
}: {
  disabled?: boolean;
  submitAction: (messageText: string) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  useLayoutEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="px-4">
      <form
        ref={formRef}
        className="group mx-auto mb-8 w-full max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const message = formData.get("message");
          invariant(typeof message === "string");

          if (message === "") return;
          formRef.current?.reset();

          startTransition(async () => {
            await submitAction(message);
          });
        }}
      >
        <div className="relative">
          <input
            name="message"
            type="text"
            placeholder="Ask anything"
            className="block w-full rounded-full border-[0.5px] border-black/25 px-6 py-4 shadow-md shadow-black/5 focus:outline-none"
            ref={inputRef}
            required
          />

          <div className="absolute inset-y-2.5 right-2.5 flex items-center justify-center">
            <button
              className="inline-flex aspect-square h-full w-full items-center justify-center rounded-full bg-gray-800 font-medium text-white group-[:has(input:invalid)]:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 enabled:hover:bg-gray-700 disabled:opacity-50"
              type="submit"
              disabled={isPending || disabled}
            >
              <ArrowUpIcon className="size-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
