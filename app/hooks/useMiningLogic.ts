import { useState, useEffect, useRef, useCallback } from 'react';
import { getUserData, updateUserBalance } from '@/lib/users'; // Adjust the import path

interface MiningState {
  balance: number;
  isMining: boolean;
  minedAmount: number;
  miningProgress: number;
  hashRate: number;
  toggleMining: () => void;
  claimDHT: () => void;
  upgradeHashRate: (amount: number) => void;
  isClaimable: boolean;
  formattedBalance: string;
  formattedMinedAmount: string;
  formattedHashRate: string;
}

interface MiningConfig {
  userId: string; // Add userId to fetch user-specific data
  initialBalance?: number;
  initialHashRate?: number;
}

export const useMiningLogic = ({
  userId,
  initialBalance = 0,
  initialHashRate = 1
}: MiningConfig): MiningState => {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [hashRate, setHashRate] = useState<number>(initialHashRate);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [minedAmount, setMinedAmount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  

  // Fetch initial user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData(userId);
        if (userData) {
          setBalance(userData.balance || initialBalance);
          setHashRate(userData.hashrate || initialHashRate);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, initialBalance, initialHashRate]);

  // Mining rate is dynamic based on hashRate
  const getMiningRate = useCallback((): number => {
    return  0.00278 * hashRate;
  }, [hashRate]);

  const MAX_MINABLE_AMOUNT = 1000;
  const UPDATE_INTERVAL = 1000;

  const cleanupMining = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const toggleMining = useCallback((): void => {
    setIsMining(prevMining => !prevMining);
  }, []);

  // Add hashRate upgrade function
  const upgradeHashRate = useCallback((amount: number): void => {
    setHashRate(prev => prev + amount);
  }, []);

  useEffect(() => {
    if (isMining) {
      intervalRef.current = setInterval(() => {
        setMinedAmount(prev => {
          const newAmount = prev + getMiningRate();
          if (newAmount >= MAX_MINABLE_AMOUNT) {
            cleanupMining();
            setIsMining(false);
            alert('Congratulations! You have mined $1000DHT tokens. To continue mining, claim your DHT.');
            return MAX_MINABLE_AMOUNT;
          }
          return newAmount;
        });
      }, UPDATE_INTERVAL);
    } else {
      cleanupMining();
    }

    return cleanupMining;
  }, [isMining, cleanupMining, getMiningRate]);

  const claimDHT = useCallback(async (): Promise<void> => {
    if (minedAmount < MAX_MINABLE_AMOUNT) {
      throw new Error('Mining must be complete before claiming.');
    }

    const newBalance = balance + minedAmount;
    setBalance(newBalance);
    setMinedAmount(0);

    // Update balance in Firestore
    try {
      await updateUserBalance(userId, newBalance);
      const formattedMinedAmount = minedAmount.toFixed(2);
      const formattedNewBalance = newBalance.toFixed(2);
      alert(`Successfully claimed ${formattedMinedAmount} DHT!\nNew Balance: ${formattedNewBalance} DHT`);
      console.log(`Claimed ${formattedMinedAmount} DHT. New Balance: ${formattedNewBalance} DHT`); 
    } catch (error) {
      console.error('Error updating balance in Firestore:', error);
      // Revert local state if Firestore update fails
      setBalance(balance);
      setMinedAmount(minedAmount);
      throw error;
    }
  }, [minedAmount, balance, userId]);

  const miningProgress = (minedAmount / MAX_MINABLE_AMOUNT) * 100;

  return {
    balance,
    isMining,
    minedAmount,
    miningProgress,
    hashRate,
    toggleMining,
    claimDHT,
    upgradeHashRate,
    isClaimable: minedAmount >= MAX_MINABLE_AMOUNT,
    formattedBalance: balance.toFixed(2),
    formattedMinedAmount: minedAmount.toFixed(3),
    formattedHashRate: `${hashRate.toFixed(1)} GH/s`
  };
};