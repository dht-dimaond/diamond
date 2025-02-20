'use client';

import { useState, useEffect } from 'react';
import { 
  TonConnectButton, 
  useTonConnectUI, 
  useTonAddress, 
  useTonWallet 
} from '@tonconnect/ui-react';
import { CHAIN } from '@tonconnect/protocol';
import {  MiningTransaction } from '@/types/telegram'; 
import TransactionsList from '../components/Transactions';
import { useUser } from '@/context/UserContext'; 
import { fetchUserTransactions, saveMiningTransaction } from '@/lib/users';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust this import based on your firebase config location


interface MiningPackage {
  id: number;
  hashRate: number;
  timeToMine: string;
  priceTON: number;
  bonusPercentage: string;
  bonusReturn:string;
  Validity: string;
}

const MINING_PACKAGES: MiningPackage[] = [
  {
    id: 1,
    hashRate: 33.33,
    timeToMine: "3 hours",
    priceTON: 1.3,
    bonusPercentage: "80% of purchase price earned at the end of validity",
    bonusReturn:"1.03 TON",
    Validity: "30 days",
  },
  {
    id: 2,
    hashRate: 50,
    timeToMine: "2 hours",
    priceTON: 2.5,
    bonusPercentage: "100% of purchase price earned at the end of validity",
    bonusReturn:"2.5 TON",
    Validity: "30 days",
  },
  {
    id: 3,
    hashRate: 100,
    timeToMine: "1 hour",
    priceTON: 4.2,
    bonusPercentage: "150% of purchase price earned at the end of validity",
    bonusReturn:"6.3 TON",
    Validity: "30 days",
  },
];

const WALLET_ADDRESS = "UQDcbF9H47WF567Wg7MqXGX2NQ4ULx4KkPDWWOu5qB1q2pRp";

export default function UpgradePage () {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const wallet = useTonWallet();

// get userdata from context

  const { userData, isLoading: userLoading } = useUser();
  const walletDevice = wallet?.device.appName ?? 'No wallet connected';
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Connect wallet';

    // Load transactions on mount or when userData changes
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

    const handlePurchase = async (pkg: MiningPackage) => {
      if (!wallet) {
        setError('Please connect your wallet first');
        return;
      }
    
      // Ensure that the user data is available from context
      if (!userData) {
        setError("User data is not loaded yet");
        return;
      }
    
      const userId = userData.id.toString(); // Use Telegram user id as string
    
      setIsLoading(true);
      setError(null);
      setSuccess(false);
    
      try {
        const result = await tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 60,
          network: CHAIN.MAINNET,
          messages: [{
            address: WALLET_ADDRESS,
            amount: BigInt(pkg.priceTON * 1e9).toString()
          }]
        });
    
        if (result) {
          try {
            // Update user's hashrate in the database
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
              hashrate: pkg.hashRate
            });
    
            // Create shortened boc code
            const shortBoc = result.boc ? `${result.boc.slice(0, 4)}...${result.boc.slice(-4)}` : 'No Code available';
    
            // Create transaction details
            const transactionDetails: MiningTransaction = {
              userId: userId,
              packageId: pkg.id,
              hashRate: pkg.hashRate,
              priceTON: pkg.priceTON,
              amount: pkg.priceTON,
              date: new Date().toISOString(),
              boc: shortBoc,
              validity: pkg.Validity,
              item: pkg.hashRate
            };
    
            // Save the transaction to Firestore in the subcollection of the user
            await saveMiningTransaction(userId, transactionDetails);
    
            setSuccess(true);
            setTransactions(prev => [...prev, transactionDetails]);
            console.log('Transaction and hashrate update successful:', result);
          } catch (dbError) {
            console.error('Database update failed:', dbError);
            setError('Transaction successful but failed to update hashrate. Please contact support.');
          }
        } else {
          setError('Transaction failed: Invalid result');
        }
      } catch (err: any) {
        console.error('Transaction failed:', err);
        setError('Purchase failed. Make sure you have sufficient balance or connect with a different TON wallet.');
      } finally {
        setIsLoading(false);
      }
    };

  // Optional: show a loading spinner if user data is still loading
  if (userLoading) {
    return <div className="min-h-screen flex justify-center items-center">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-200">Mining Packages</h1>
          <div className="mt-4 flex justify-center">
            <TonConnectButton />
          </div>
        </div>

        {/* Wallet Info */}
        {wallet && (
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-md font-semibold text-gray-600">
               Connected: <span className="font-mono text-blue-600">{shortAddress}</span>
              <span className="ml-2 text-gray-400">({walletDevice})</span>
            </p>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-700">Purchase successful, Your hashrate has been increased. Restart the app or refresh your server.</p>
          </div>
        )}

        {/* Mining Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-gray-700 rounded-xl p-6 shadow-xl bg-gradient-to-b from-gray-900/80 to-black/50">
          {MINING_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="bg-gradient-to-b from-gray-800 via-gray-800 to-gray-1000 rounded-lg p-6 backdrop-blur-md shadow-md w-full max-w-full text-white">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold ">
                  {pkg.hashRate} H/s
                </h3>
                <div className="text-gray-100">
                  <p>Mining Time: {pkg.timeToMine} <span className="text-white/50 text-xs">(to mine $1000DHT)</span></p>
                  <p>Price: {pkg.priceTON} TON</p>
                  <p>Validity: {pkg.Validity}</p>
                  <p className="text-white">Bonus: <span className="text-sm text-green-400">{pkg.bonusPercentage} <span className='text-white/50 text-xs'>({pkg.bonusReturn})</span></span></p>
                </div>
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={isLoading || !wallet}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium
                    ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                    ${!wallet ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isLoading ? 'Processing...' : `Buy ${pkg.priceTON} TON`}
                </button>
              </div>
            </div>
          ))}
        </div>

        <TransactionsList transactions={transactions} />
      </div>
    </div>
  );
}