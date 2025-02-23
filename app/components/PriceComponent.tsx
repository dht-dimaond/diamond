"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore instance
import { doc, onSnapshot } from "firebase/firestore";

export default function PriceComponent() {
  const [price, setPrice] = useState("0.00");
  const [change, setChange] = useState("0.00");

  useEffect(() => {
    const docRef = doc(db, "prices", "latest");

    // Real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPrice(docSnap.data().price);
        setChange(docSnap.data().change);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Determine color based on positive or negative change
  const isNegative = Number(change) < 0;
  const textColor = isNegative ? "text-red-400" : "text-green-400";
  const bgColor = isNegative ? "bg-red-500/20" : "bg-green-500/20";
  const sign = isNegative ? "-" : "+";

  return (
    <div className="flex items-center">
      <span className="text-xl font-semibold text-blue-200">${price}</span>
      <span className={`ml-2 px-2 py-1 text-sm ${bgColor} ${textColor} rounded-lg flex items-center`}>
        <span className="mr-1">{sign}</span>{Math.abs(Number(change))}%
      </span>
    </div>
  );
}
