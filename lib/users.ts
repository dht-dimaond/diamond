import { doc, setDoc, getDoc, updateDoc,collection, addDoc, getDocs  } from 'firebase/firestore';
import { db } from './firebase';
import { TelegramUser, UserData } from '@/types/telegram';
import { MiningTransaction } from '@/types/telegram';

export const saveUserData = async (telegramData: TelegramUser): Promise<void> => {
  try {
    const userRef = doc(db, 'users', telegramData.id.toString());

    // Check if the user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      const userData: UserData = {
        telegramId: telegramData.id,
        username: telegramData.username || '',
        firstName: telegramData.first_name,
        lastName: telegramData.last_name || '',
        isPremium: telegramData.is_premium || false,
        hashrate: 20,
        balance: 0,
        createdAt: new Date().toISOString(),
        twitterComplete: false,
        twitterRewardClaimed: false,
        telegramComplete: false,
        telegramRewardClaimed: false,
        referralRewardClaimed: false
      };

      await setDoc(userRef, userData);
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      balance: newBalance
    });
  } catch (error) {
    console.error('Error updating balance:', error);
    throw error;
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// New function to complete social mission
export const completeSocialMission = async (
  userId: string, 
  platform: 'twitter' | 'telegram'
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    // Update the completion status
    await updateDoc(userRef, {
      [`${platform}Complete`]: true
    });
  } catch (error) {
    console.error('Error completing social mission:', error);
    throw error;
  }
};

// New function to claim mission reward
export const claimMissionReward = async (
  userId: string,
  missionType: 'twitter' | 'telegram' | 'referral',
  rewardAmount: number
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as UserData;

    // Prepare update data
    const updateData: any = {
      balance: userData.balance + rewardAmount,
      [`${missionType}RewardClaimed`]: true
    };

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
};

export const saveMiningTransaction = async (
  userId: string, 
  transaction: MiningTransaction
): Promise<void> => {
  try {
    // Using a subcollection under the user document
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    await addDoc(transactionsRef, transaction);
    console.log('Transaction saved successfully');
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
};

export const fetchUserTransactions = async (userId: string): Promise<MiningTransaction[]> => {
  try {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const querySnapshot = await getDocs(transactionsRef);
    const transactions: MiningTransaction[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as MiningTransaction);
    });
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};