import { connection } from 'next/server';
import { Suspense } from 'react';
import { MessageBox } from './message-box';

export default async function Home() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}

async function Content() {
  await connection();
  const newId = crypto.randomUUID();

  return (
    <div className="m-4">
      <div className="mt-8">
        <MessageBox newId={newId} />
      </div>
    </div>
  );
}
