import { db } from '@/db';
import { redirect } from 'next/navigation';
import { getSession } from './session';
import { connection } from 'next/server';

export type User = {
  id: string;
  email: string;
};

export async function getCurrentUser(): Promise<User> {
  await connection();
  const { userId } = await getSession();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, userId),
    columns: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}
