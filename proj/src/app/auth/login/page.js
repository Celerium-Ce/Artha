import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">🏠 Home Page</h1>
      <p className="mt-4">Welcome! Please sign in.</p>
      <Link href="/login">
        <button className="mt-6 p-3 bg-blue-500 rounded">Go to Login</button>
      </Link>
    </div>
  );
}
