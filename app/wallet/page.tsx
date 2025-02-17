'use client'

import DHTBalanceCard from '../components/DHTBalanceCard';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext'
import { getUserData } from '@/lib/users'; // Adjust the import path
import TransactionsList from '../components/Transactions';
import { fetchUserTransactions } from '@/lib/users';

export default function Home() {
  const { userData } = useUser();
  const [balance,setBalance] =useState<number>();
  const [transactions, setTransactions] = useState<any[]>([]);

    // Fetch user data from Firestore when userData is available
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          // Get userId from UserContext
          if (!userData?.id) {
            console.error('User ID is missing');
            return;
          }
  
          const userId = userData.id.toString(); // Ensure userId is a string
          const userFirestoreData = await getUserData(userId);
  
          if (userFirestoreData) {
            setBalance(userFirestoreData.balance);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
    }, [userData]); // Add userData as a dependency

    useEffect(() => {
          if (!userData) return;
          
          const loadTransactions = async () => {
            try {
              // Use the Telegram user ID (converted to string) as your user identifier
              const userId = userData.id.toString();
              const userTransactions = await fetchUserTransactions(userId);
              setTransactions(userTransactions);
            } catch (err) {
              console.error("Error loading transactions:", err);
            }
          };
      
          loadTransactions();
        }, [userData]);

  return (
    <div className="flex flex-col justify-center items-center p-2 rounded-lg shadow-lg max-w-4xl mx-auto">
       <DHTBalanceCard balance={balance ?? 0} imageSrc="/coin.png" />
      <h1 className="text-3xl font-semibold text-gray-200 mt-6 mb-6">Transaction History</h1>
      <TransactionsList transactions={transactions} />
    </div>
  );
}