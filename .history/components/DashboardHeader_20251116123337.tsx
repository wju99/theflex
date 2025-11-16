import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="bg-[#1a4d3a] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#1a4d3a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold">the flex.</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

