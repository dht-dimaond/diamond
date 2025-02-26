export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
  }
  
  export interface UserData {
    telegramId: number;
    username: string;
    firstName: string;
    lastName: string;
    isPremium: boolean;
    hashrate: number;
    balance: number;
    createdAt: string;
    twitterComplete: boolean;
    twitterRewardClaimed: boolean;
    telegramComplete: boolean;
    telegramRewardClaimed: boolean;
    referralRewardClaimed: boolean;
    referrals?: string[];
    referrer?: string | null;
    isAmbassador: boolean;
    grandPrizeRewardClaimed: boolean;
    diamondlastnameComplete: boolean;
    diamondlastnameRewardClaimed: boolean;
    
  }
  


  // Define your package details interface
export interface MiningPackage {
  priceTON: number;
  hashRate: string;
  Validity: string;
}

// Define the structure for transaction details
export interface TransactionDetails {
  amount: number;
  date: string;     // ISO formatted date string
  item: string;
  boc: string;
  validity: string;
}

// Define the props for the TransactionsList component
export interface TransactionsListProps {
  transactions: TransactionDetails[];
}


// In your types/telegram.ts (or similar)
export interface MiningTransaction {
  id?: string;                    // Firestore auto-generated ID
  userId: string;                 // Telegram user ID as string
  packageId: number;              // Reference to the purchased package
  hashRate: number;               // Hash rate from the package
  priceTON: number;              // Price in TON
  amount: number;                 // Actual amount paid
  date: string;                   // ISO formatted date string
  boc: string;                    // Blockchain transaction data
  validity: string;   
  item: string | number;          
}

