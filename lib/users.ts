import { 
  doc, setDoc, getDoc, updateDoc, collection, 
  addDoc, getDocs, arrayUnion, where, query,
  writeBatch, runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { TelegramUser, UserData } from '@/types/telegram';
import { MiningTransaction } from '@/types/telegram';

// Helper for numeric ID validation
const validateNumericId = (id: string): number => {
  const numId = Number(id);
  if (isNaN(numId)) throw new Error('Invalid ID format');
  return numId;
};

export const saveUserData = async (telegramData: TelegramUser): Promise<void> => {
  try {
    const userId = telegramData.id.toString();
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const initialData: UserData = {
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
        referralRewardClaimed: false,
        referrals: [],
        referralsCount: 0,
        referrer: null,
        isAmbassador: false,
        grandPrizeRewardClaimed: false,
        diamondlastnameComplete: false,
        diamondlastnameRewardClaimed: false,
      };

      await setDoc(userRef, initialData);
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const handleReferral = async (userId: string, referrerIdParam: string): Promise<void> => {
  try {
    // Validate and convert IDs
    const referrerId = validateNumericId(referrerIdParam);
    const numericUserId = validateNumericId(userId);

    if (numericUserId === referrerId) {
      throw new Error('Self-referral not allowed');
    }

    await runTransaction(db, async (transaction) => {
      // Document references
      const userRef = doc(db, 'users', userId);
      const referrerRef = doc(db, 'users', referrerId.toString());

      // Get both documents
      const [userDoc, referrerDoc] = await Promise.all([
        transaction.get(userRef),
        transaction.get(referrerRef)
      ]);

      // Validate documents
      if (!userDoc.exists()) throw new Error('User not found');
      if (!referrerDoc.exists()) throw new Error('Referrer not found');
      if (userDoc.data()?.referrer) throw new Error('User already has a referrer');

      // Update referred user
      transaction.update(userRef, { 
        referrer: referrerId 
      });

      // Update referrer's data
      const referrerData = referrerDoc.data() as UserData;
      transaction.update(referrerRef, {
        referrals: arrayUnion(userId),
        referralsCount: (referrerData.referralsCount || 0) + 1
      });
    });

  } catch (error) {
    console.error('Referral processing error:', error);
    throw error;
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() as UserData : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const getReferrerData = async (userId: string): Promise<UserData | null> => {
  try {
    const userData = await getUserData(userId);
    return userData?.referrer ? await getUserData(userData.referrer.toString()) : null;
  } catch (error) {
    console.error('Error fetching referrer:', error);
    return null;
  }
};

export const getReferralsWithDetails = async (userId: string): Promise<UserData[]> => {
  try {
    const userData = await getUserData(userId);
    if (!userData?.referrals?.length) return [];

    // Batch get referrals with valid IDs
    const validIds = userData.referrals
      .map(id => id.toString())
      .filter(id => id.match(/^\d+$/));

    const q = query(
      collection(db, 'users'),
      where('__name__', 'in', validIds)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserData);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return [];
  }
};

// Keep other functions (updateUserBalance, completeSocialMission, 
// claimMissionReward, etc.) as they were with proper typing

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { balance: newBalance });
  } catch (error) {
    console.error('Balance update error:', error);
    throw error;
  }
};

// Transaction-safe mission completion
export const completeSocialMission = async (
  userId: string,
  platform: 'twitter' | 'telegram' | 'diamondlastname'
): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) throw new Error('User not found');
      if (userDoc.data()?.[`${platform}Complete`]) return;

      transaction.update(userRef, {
        [`${platform}Complete`]: true
      });
    });
  } catch (error) {
    console.error('Mission completion error:', error);
    throw error;
  }
};

// Atomic reward claiming
export const claimMissionReward = async (
  userId: string,
  missionType: 'twitter' | 'telegram' | 'referral' | 'grandPrize' | 'diamondlastname',
  rewardAmount: number
): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) throw new Error('User not found');
      const userData = userDoc.data() as UserData;

      if (userData[`${missionType}RewardClaimed`]) {
        throw new Error('Reward already claimed');
      }

      transaction.update(userRef, {
        balance: userData.balance + rewardAmount,
        [`${missionType}RewardClaimed`]: true
      });
    });
  } catch (error) {
    console.error('Reward claim error:', error);
    throw error;
  }
};