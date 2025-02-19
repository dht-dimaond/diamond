'use client';

import WithdrawButton from '../components/WithdrawButton';
import Image from 'next/image';

interface BalanceCardProps {
  balance: number;
  imageSrc: string;
}

export default function DHTBalanceCard({ balance, imageSrc }: BalanceCardProps) {
  return (
    <div className="w-full flex items-center justify-between rounded-xl p-2 border-2 border-b-gray-700 border-t-0 border-r-0 border-l-0 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg">
      {/* Center: DHT Balance */}
      <div className="flex flex-row items-center">
        {/* Image with required width and height */}
        <Image
          src={imageSrc}
          alt="DHT Icon"
          width={48} // Required: Matches w-13 (13 * 4 = 52)
          height={30} // Required: Matches h-10 (10 * 4 = 40)
          className="w-13 h-10" // Optional: Additional styling
        />
        <div className="flex flex-col justify-start px-2">
          <span className="text-xs font-semibold text-gray-400">DHT Balance</span>
          <span className="text-l font-semibold text-white">{Math.floor(balance)} $DHT</span>
        </div>
      </div>
      {/* Right: Withdraw Button */}
      <WithdrawButton />
    </div>
  );
}