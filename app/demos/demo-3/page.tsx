import { db } from '@/db';
import Client from './client';

export default async function Page() {
  const messages = await db.query.demoMessages.findMany();

  // Artificial delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return <Client messages={messages} />;
}
