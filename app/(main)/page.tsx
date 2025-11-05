'use client';

import { useOptimistic } from 'react';
import { createChat } from './actions';
import { MessageBox } from './message-box';

export default function Home() {
  const [optimisticMessage, setOptimisticMessage] = useOptimistic<
    null | string
  >(null);

  return (
    <div className="m-4">
      <div className="mt-8">
        {optimisticMessage && <p>{optimisticMessage}</p>}

        <MessageBox
          submitAction={async (message) => {
            setOptimisticMessage(message);
            const newId = window.crypto.randomUUID();

            await createChat(newId, message);
          }}
        />
      </div>
    </div>
  );
}
