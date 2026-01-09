"use server";

import { db } from "@/db";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import * as z from "zod";

export type SignInState = null | {
  error: string;
  formData: FormData;
};

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const result = z
    .object({
      email: z.email(),
      password: z.string(),
    })
    .safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: "These credentials do not match our records.", formData };
  }

  const { email, password } = result.data;

  const user = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, email),
  });

  if (!user) {
    return { error: "These credentials do not match our records.", formData };
  }

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordsMatch) {
    return { error: "These credentials do not match our records.", formData };
  }

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  redirect("/");
}
