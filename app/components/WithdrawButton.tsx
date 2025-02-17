'use client'

import Link from 'next/link'; // Import Link from Next.js

export default function WithdrawButton() {
  return (
    <Link href="/wallet"> {/* Wrap the button with Link */}
      <button className="border border-blue-600 text-blue-200 px-4 py-1.5 text-xs rounded-xl shadow-md hover:bg-blue-800 transition duration-200 ease-in-out">
        Withdraw
      </button>
    </Link>
  );
}
