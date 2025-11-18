import { db } from '@/db';
import Client from './client';

export default async function Page() {
  const messagesPromise = db.query.demoMessages.findMany();

  return <Client messagesPromise={messagesPromise} />;
}
