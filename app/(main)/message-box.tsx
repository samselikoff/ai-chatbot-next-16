'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import invariant from 'tiny-invariant';
import { useProvider } from './_components/Provider';
// import { createChat } from './actions';
// import { useEffect } from 'react';

export function MessageBox({ newId }: { newId: string }) {
  const router = useRouter();
  const { setNewMessage } = useProvider();
  const newUrl = `/chat/${newId}?new`;
  // const pathname = usePathname();

  // useEffect(() => {
  //   return () => {
  //     console.log(window.location.pathname);
  //     // This value has the new URL... kick off createChat action here?
  //   };
  // }, [pathname]);

  return (
    <div>
      <Link href={newUrl} />
      <form
        action={(formData) => {
          const message = formData.get('message');
          invariant(typeof message === 'string');
          setNewMessage(message);

          router.push(newUrl);
        }}
      >
        <input type="hidden" readOnly name="id" value={newId} />
        <div>
          <input
            name="message"
            type="text"
            placeholder="Enter a message..."
            className="border px-2 py-1 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-2 py-1 rounded"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
