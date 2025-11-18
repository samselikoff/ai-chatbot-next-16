import { db } from '@/db';
import Client from './client';

export default async function Page() {
  const messages = await db.query.demoMessages.findMany();

  return <Client messages={messages} />;
}
