import { db } from '@/db';
import { redirect } from 'next/navigation';
import { getSession } from './session';

export async function getCurrentUser() {
  const { userId } = await getSession();

  if (!userId) {
    redirect('/login');
  }

  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, userId),
    columns: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return user;
}
