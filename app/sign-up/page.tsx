import { db } from '@/db';
import { users } from '@/db/schema';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as z from 'zod';

async function signUp(formData: FormData) {
  'use server';

  const { email, password } = z
    .object({
      email: z.email(),
      password: z.string().nonempty().min(8),
    })
    .parse(Object.fromEntries(formData));

  console.log(email);
  console.log(password);

  const existingUser = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, email),
  });

  if (existingUser) {
    throw new Error('already in use');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  redirect('/');
}

export default async function Page() {
  return (
    <>
      <div className="flex min-h-dvh bg-gray-50 w-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            <form action={signUp} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-700">
            {`Already have an account?`}{' '}
            <Link
              href="/sign-in"
              className="font-semibold text-gray-800 hover:text-gray-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
