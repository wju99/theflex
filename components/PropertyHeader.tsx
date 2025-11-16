import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function PropertyHeader() {
  return (
    <header className={`bg-[rgb(40,78,76)] text-white shadow-lg ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/theflex-logo-white.webp"
              alt="the flex."
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/properties"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              Properties
            </Link>
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

