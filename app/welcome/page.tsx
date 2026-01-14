import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl rounded-2xl bg-white px-12 py-20 text-center shadow-lg">
        <h1 className="text-4xl font-medium">Welcome to Next 16 AI Chat!</h1>

        <div className="mt-20 flex gap-4">
          <Link
            className="w-1/2 rounded-full bg-gray-900 py-2 font-medium text-white hover:bg-gray-800"
            href="/sign-up"
          >
            Create account
          </Link>
          <Link
            className="w-1/2 rounded-full border border-gray-300 py-2 font-medium text-gray-900 hover:bg-gray-50"
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
