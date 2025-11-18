'use client';

import { useRef, useState } from 'react';
import { getStream } from './actions';

export default function Page() {
  const [response, setResponse] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <main className="grow flex flex-col justify-center max-w-xl mx-auto">
      <h1 className="text-lg mt-20 text-center">
        What can I help you with today?
      </h1>

      <div className="mt-8">
        <form
          action={async (formData) => {
            const message = formData.get('message');
            if (typeof message !== 'string') return;

            formRef.current?.reset();

            const stream = await getStream(message);

            setResponse('');
            for await (const delta of stream) {
              setResponse((curr) => curr + delta);
            }
          }}
          ref={formRef}
        >
          <input
            name="message"
            type="text"
            placeholder="Ask anything"
            className="border-[0.5px] shadow-md shadow-black/5 py-4 px-6 rounded-full block w-full focus:outline-none border-black/25"
            autoFocus
            required
          />
        </form>
      </div>

      {response && (
        <div className="mt-8">
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}
