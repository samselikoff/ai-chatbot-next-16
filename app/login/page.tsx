import { db } from '@/db';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import * as z from 'zod';

async function login(formData: FormData) {
  'use server';

  const { email, password } = z
    .object({
      email: z.string(),
      password: z.string(),
    })
    .parse(Object.fromEntries(formData));

  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, email),
  });

  if (!user) {
    console.log('email doesnt exist');
    return;
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    console.log('bad password');
    return;
  }

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  redirect('/');
}

export default async function Page() {
  return (
    <div className="p-8">
      <p>Logg in</p>
      <form action={login}>
        <input
          className="border"
          name="email"
          type="email"
          placeholder="email"
        />

        <input
          className="border"
          type="password"
          name="password"
          placeholder="password"
        />

        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
