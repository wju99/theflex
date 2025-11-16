import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Flex Living Reviews Dashboard
        </h1>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <p className="text-gray-600 mt-4">
            API Status: Check /api/reviews/hostaway
          </p>
        </div>
      </div>
    </main>
  );
}

