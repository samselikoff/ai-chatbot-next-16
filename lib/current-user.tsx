import { db } from '@/db';
import { getSession } from './session';

export async function getCurrentUser() {
  const { userId } = await getSession();

  if (!userId) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, userId),
    columns: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}
