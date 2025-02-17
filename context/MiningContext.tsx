import { createContext, useContext, ReactNode } from 'react';
import { useMiningLogic } from '@/app/hooks/useMiningLogic';
import { useUser } from '@/context/UserContext';

interface MiningContextType {
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

const MiningContext = createContext<MiningContextType | null>(null);

export function MiningProvider({ children }: { children: ReactNode }) {
  const { userData } = useUser();
  const miningState = useMiningLogic({
    userId: userData?.id?.toString() || '',
    initialBalance: 0,
    initialHashRate: 1000,
  });

  return (
    <MiningContext.Provider value={miningState}>
      {children}
    </MiningContext.Provider>
  );
}

export function useMining() {
  const context = useContext(MiningContext);
  if (!context) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
}