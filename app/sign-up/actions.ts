"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";

export type SignUpState = null | {
  error: string;
  formData: FormData;
};

export async function signUp(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const result = z
    .object({
      email: z.email(),
      password: z.string().nonempty().min(8),
    })
    .safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      error: "Please enter a valid email and password (min 8 characters).",
      formData,
    };
  }

  const { email, password } = result.data;

  const existingUser = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, email),
  });

  if (existingUser) {
    return { error: "This email is already in use.", formData };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  (await cookies()).set("isLoggedIn", "1");

  redirect("/");
}
