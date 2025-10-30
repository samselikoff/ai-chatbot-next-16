'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import invariant from 'tiny-invariant';
import { useProvider } from './_components/Provider';

export function Form({ newId }: { newId: string }) {
  const router = useRouter();
  const { setNewMessage } = useProvider();
  const newUrl = `/new-chat/${newId}?new`;

  return (
    <div>
      <Link href={newUrl}>asdf</Link>
      <form
        action={async (formData) => {
          const message = formData.get('message');
          invariant(typeof message === 'string');
          setNewMessage(message);
          router.push(newUrl);
        }}
      >
        <input type="text" readOnly name="id" value={newId} />
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
