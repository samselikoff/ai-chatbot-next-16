'use client';

import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import invariant from 'tiny-invariant';
import { useProvider } from './_components/Provider';
import { useRouter } from 'next/navigation';
import { createChat, sleepAction } from './actions';
// import { createChat } from './actions';
// import { useEffect } from 'react';

export function MessageBox({
  submitAction,
}: {
  submitAction: (message: string) => Promise<void>;
}) {
  const router = useRouter();
  const provider = useProvider();
  // const newUrl = `/chat/${newId}`;

  return (
    <div>
      {/* <form
        action={() => {
          router.push('/chat/ad9c4102-4823-4e70-b7d3-40a1e74bd181');
        }}
      >
        <button type="submit">Navigate to another chat</button>
      </form> */}

      {/* <button
        onClick={() => {
          // router.push('/about');
          router.push('/chat/ad9c4102-4823-4e70-b7d3-40a1e74bd181');
        }}
      >
        Navigate via router.push
      </button> */}

      {/* <Link href={newUrl} /> */}
      <form
        action={async (formData) => {
          const message = formData.get('message');
          invariant(typeof message === 'string');
          await submitAction(message);
          // const newId = window.crypto.randomUUID();
          // // setNewMessage(message);

          // await createChat(newId, message);
          // provider.dispatch({ type: 'createChat', id: newId, message });

          // await sleepAction();
          // router.push(`/chat/${newId}?new`);

          // router.push('/chat/ad9c4102-4823-4e70-b7d3-40a1e74bd181');
          // router.push(newUrl);
          // await p;

          // window.history.pushState({}, '', `/chat/${newId}`);
        }}
      >
        {/* <input type="hidden" readOnly name="id" value={newId} /> */}
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
