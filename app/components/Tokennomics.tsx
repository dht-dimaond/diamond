"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore instance
import { doc, onSnapshot } from "firebase/firestore";

interface TokenDistribution {
  name: string;
  percentage: number;
  color: string;
}

const Tokenomics: React.FC = () => {
  const [distributions, setDistributions] = useState<TokenDistribution[]>([]);

  useEffect(() => {
    const docRef = doc(db, "tokenomics", "distribution");

    // Real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDistributions(docSnap.data().distributions);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-800 via-gray-800 to-gray-1000 rounded-lg p-6 backdrop-blur-md shadow-md w-full max-w-full text-white">
      <h3 className="mt-4 text-xl text-center font-semibold">Token Distribution</h3>
      {distributions.map((item, index) => (
        <div key={index} className="mt-2 p-4 border-2 border-b-gray-700 border-t-0 border-r-0 border-l-0 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{item.name}</span>
            <span>{item.percentage}%</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div
              className={`h-2 ${item.color} rounded-full`}
              style={{ width: `${item.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tokenomics;
