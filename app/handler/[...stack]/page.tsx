import { StackHandler } from '@stackframe/stack';
import { stackServerApp } from '../../../stack/server';
import { connection } from 'next/server';
import { Suspense } from 'react';

export default async function Handler(props: PageProps<'/handler/[...stack]'>) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}

async function Content(props: PageProps<'/handler/[...stack]'>) {
  await connection();

  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
