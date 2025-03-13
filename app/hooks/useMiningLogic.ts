import { useState, useEffect, useRef, useCallback } from 'react';
import { getUserData, updateUserBalance } from '@/lib/users';

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
  userId: string; 
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

  const MAX_MINABLE_AMOUNT = 100;
  const UPDATE_INTERVAL = 1000;

  
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

  useEffect(() => {
    const savedProgress = localStorage.getItem('miningProgress');
    if (savedProgress) {
      const { timestamp, amount, savedHashRate } = JSON.parse(savedProgress);
      const elapsedSeconds = (Date.now() - timestamp) / 1000;
      const offlineEarnings = 0.00278 * savedHashRate * elapsedSeconds;
      const totalMined = Math.min(MAX_MINABLE_AMOUNT, amount + offlineEarnings);
      
      setMinedAmount(totalMined);
      setHashRate(savedHashRate);
      setIsMining(totalMined < MAX_MINABLE_AMOUNT);
    }
  }, []);

  const getMiningRate = useCallback((): number => {
    return 0.00278 * hashRate;
  }, [hashRate]);

  const cleanupMining = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const toggleMining = useCallback((): void => {
    setIsMining(prevMining => {
      // Save mining start state when starting mining
      if (!prevMining) {
        localStorage.setItem('miningProgress', JSON.stringify({
          timestamp: Date.now(),
          amount: minedAmount,
          savedHashRate: hashRate
        }));
      }
      return !prevMining;
    });
  }, [minedAmount, hashRate]);

  const upgradeHashRate = useCallback((amount: number): void => {
    setHashRate(prev => {
      const newRate = prev + amount;

      if (isMining) {
        localStorage.setItem('miningProgress', JSON.stringify({
          timestamp: Date.now(),
          amount: minedAmount,
          savedHashRate: newRate
        }));
      }
      return newRate;
    });
  }, [isMining, minedAmount]);

  useEffect(() => {
    if (isMining) {
      intervalRef.current = setInterval(() => {
        setMinedAmount(prev => {
          const newAmount = prev + getMiningRate();
          if (newAmount >= MAX_MINABLE_AMOUNT) {
            cleanupMining();
            setIsMining(false);
            localStorage.removeItem('miningProgress');
            alert('Congratulations! You have mined $100 DHT tokens. To continue mining, claim your DHT.');
            return MAX_MINABLE_AMOUNT;
          }
          
          localStorage.setItem('miningProgress', JSON.stringify({
            timestamp: Date.now(),
            amount: newAmount,
            savedHashRate: hashRate
          }));
          return newAmount;
        });
      }, UPDATE_INTERVAL);
    } else {
      cleanupMining();
    }

    return cleanupMining;
  }, [isMining, cleanupMining, getMiningRate, hashRate]);

  const claimDHT = useCallback(async (): Promise<void> => {
    if (minedAmount < MAX_MINABLE_AMOUNT) {
      throw new Error('Mining must be complete before claiming.');
    }

    const newBalance = balance + minedAmount;

    try {
      await updateUserBalance(userId, newBalance);
      setBalance(newBalance);
      setMinedAmount(0);
      localStorage.removeItem('miningProgress');
      
      const formattedMinedAmount = minedAmount.toFixed(2);
      const formattedNewBalance = newBalance.toFixed(2);
      alert(`Successfully claimed ${formattedMinedAmount} DHT!\nNew Balance: ${formattedNewBalance} DHT`);
      console.log(`Claimed ${formattedMinedAmount} DHT. New Balance: ${formattedNewBalance} DHT`);
    } catch (error) {
      console.error('Error updating balance in Firestore:', error);
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