import { stackServerApp } from '@/stack/server';

export default async function Home() {
  const user = await stackServerApp.getUser();

  return <p>{user?.id}</p>;
  // const users = await stackServerApp.listUsers();

  // return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
