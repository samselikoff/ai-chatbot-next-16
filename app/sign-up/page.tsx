"use client";

import { useActionState } from "react";
import Link from "next/link";
import clsx from "clsx";
import Spinner from "@/components/Spinner";
import { signUp } from "./actions";

export default function Page() {
  const [state, action, isPending] = useActionState(signUp, null);

  return (
    <>
      <div className="flex min-h-dvh w-full flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            <form action={action} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={`${state?.formData?.get("email") ?? ""}`}
                    className={clsx(
                      "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6",
                      state?.error ? "outline-red-500" : "outline-gray-300",
                    )}
                  />
                </div>
                {state?.error && (
                  <p className="mt-2 text-sm text-red-600">{state.error}</p>
                )}
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
                    defaultValue={`${state?.formData?.get("password") ?? ""}`}
                    autoComplete="new-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
                >
                  <Spinner loading={isPending}>Create account</Spinner>
                </button>
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-700">
            {`Already have an account?`}{" "}
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
