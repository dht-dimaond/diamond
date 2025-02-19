'use client'

import Link from 'next/link'; // Import Link from Next.js
import { ArrowLeftRight  } from 'lucide-react'

export default function WithdrawButton() {
  return (
    <div>
      <Link href="/wallet"> {/* Wrap the button with Link */}
      <div className="border border-blue-600 text-blue-200 flex flex-col items-center justify-center px-2 py-1.5 items-center text-xs rounded-xl shadow-md hover:bg-blue-800 transition duration-200 ease-in-out">
         <p className='text-center'><ArrowLeftRight /></p>
         <p>Swap </p>
         <span className='text-gray-400'>(Coming soon)</span>
      </div>
   </Link>
   </div>
 );
}
