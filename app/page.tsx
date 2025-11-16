import Link from "next/link";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f1eb]">
      <DashboardHeader />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Flex Living Reviews Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage and review guest feedback for your properties
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-[#1a4d3a] text-white rounded-lg hover:bg-[#2d6b4f] transition-colors font-semibold text-lg shadow-lg"
            >
              Go to Dashboard
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              API Status: Check /api/reviews/hostaway
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

