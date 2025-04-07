import { doc, setDoc, getDoc, updateDoc,collection, addDoc, getDocs, arrayUnion, where, query, writeBatch  } from 'firebase/firestore';
import { db } from './firebase';
import { TelegramUser, UserData } from '@/types/telegram';
import { MiningTransaction } from '@/types/telegram';

export const saveUserData = async (telegramData: TelegramUser): Promise<void> => {
  try {
    const userRef = doc(db, 'users', telegramData.id.toString());

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
        youtubeComplete: false,
        youtubeRewardClaimed: false,
        tiktokComplete: false,
        tiktokRewardClaimed: false,
        referralRewardClaimed: false,
        referrals: [],  
        referrer: null ,    
        isAmbassador: false,
        grandPrizeRewardClaimed: false,
        diamondlastnameComplete: false,  
        diamondlastnameRewardClaimed: false,  
      };

      await setDoc(userRef, userData);
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};


export const updateAllUsers = async (): Promise<void> => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    const batch = writeBatch(db);
    const defaultNewFields = {

        diamondlastnameComplete: false,  
        diamondlastnameRewardClaimed: false, 
        youtubeComplete: false,
        youtubeRewardClaimed: false,
        tiktokComplete: false,
        tiktokRewardClaimed: false, 
    };

    querySnapshot.forEach((document) => {
      const userRef = doc(db, 'users', document.id);
      batch.set(userRef, defaultNewFields, { merge: true });
    });

    await batch.commit();
    console.log('All users updated with new fields');
  } catch (error) {
    console.error('Error updating all users:', error);
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

export const completeSocialMission = async (
  userId: string, 
  platform: 'twitter' | 'telegram' | 'diamondlastname' | 'youtube' | 'tiktok'
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }


    await updateDoc(userRef, {
      [`${platform}Complete`]: true
    });
  } catch (error) {
    console.error('Error completing social mission:', error);
    throw error;
  }
};

export const claimMissionReward = async (
  userId: string,
  missionType: 'twitter' | 'telegram' | 'referral' | 'grandPrize' | 'diamondlastname' | 'youtube' | 'tiktok',
  rewardAmount: number,
  additionalUpdates?: object
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as UserData;

    const updateData: any = {
      balance: userData.balance + rewardAmount,
      [`${missionType}RewardClaimed`]: true
    };

     if (additionalUpdates) {
      Object.assign(updateData, additionalUpdates);
    }

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

export const handleReferral = async (userId: string, referrerId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const referrerRef = doc(db, 'users', referrerId);
    
    const userDoc = await getDoc(userRef);


   if (!userDoc.exists()) {
      
      const userData: UserData = {
        telegramId: parseInt(userId),
        username: '',
        firstName: '',
        lastName: '',
        isPremium: false,
        hashrate: 20,
        balance: 0,
        createdAt: new Date().toISOString(),
        twitterComplete: false,
        twitterRewardClaimed: false,
        telegramComplete: false,
        telegramRewardClaimed: false,
        youtubeComplete: false,
        youtubeRewardClaimed: false,
        tiktokComplete: false,
        tiktokRewardClaimed: false,
        referralRewardClaimed: false,
        referrals: [],
        referrer: null,
        isAmbassador: false,
        grandPrizeRewardClaimed: false,
        diamondlastnameComplete: false,
        diamondlastnameRewardClaimed: false,
      };
      
      await setDoc(userRef, userData);
    } else if (userDoc.data().referrer) {
      return;
    }
    const referrerDoc = await getDoc(referrerRef);
    if (!referrerDoc.exists()) {
      throw new Error('Referrer not found');
    }
    
    if (userId === referrerId) {
      throw new Error('Cannot refer yourself');
    }

    await updateDoc(userRef, {
      referrer: referrerId
    });

    await updateDoc(referrerRef, {
      referrals: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error handling referral:', error);
    throw error;
  }
};

export const getUserReferrals = async (userId: string): Promise<string[]> => {
  try {
    const userData = await getUserData(userId);
    return userData?.referrals || [];
  } catch (error) {
    console.error('Error getting referrals:', error);
    throw error;
  }
};

export const getReferrerData = async (userId: string): Promise<UserData | null> => {
  try {
    const userData = await getUserData(userId);
    return userData?.referrer ? await getUserData(userData.referrer) : null;
  } catch (error) {
    console.error('Error getting referrer data:', error);
    return null;
  }
};

export const getReferralsWithDetails = async (userId: string): Promise<UserData[]> => {
  try {
    const userData = await getUserData(userId);
    if (!userData?.referrals?.length) return [];
    
    const referralsSnapshot = await getDocs(
      query(collection(db, 'users'), where('__name__', 'in', userData.referrals))
    );
    
    return referralsSnapshot.docs.map(doc => doc.data() as UserData);
  } catch (error) {
    console.error('Error getting referrals with details:', error);
    return [];
  }
};




//..........................................................................................................................
//streak
interface StreakData {
  currentStreak: number;
  highestStreak: number;
  lastLoginDate: string;
  startDate: string;
}

// Update user streak based on telegram ID
export const updateUserStreak = async (telegramId: string): Promise<StreakData | null> => {
  try {
    const userRef = doc(db, 'users', telegramId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.error('User not found in the database');
      return null;
    }
    
    const userData = userDoc.data();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const todayStr = today.toISOString().split('T')[0];
    
    // Check if user has streak data
    let streakData: StreakData;
    
    if (!userData.streak) {
      // First time user is logging in for streak tracking
      streakData = {
        currentStreak: 1,
        highestStreak: 1,
        lastLoginDate: todayStr,
        startDate: todayStr
      };
    } else {
      streakData = userData.streak;
      const lastLoginDate = new Date(streakData.lastLoginDate);
      lastLoginDate.setHours(0, 0, 0, 0);
      
      // Calculate difference in days
      const daysDifference = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference === 0) {
        // Already logged in today, no streak update needed
        return streakData;
      } else if (daysDifference === 1) {
        // Consecutive day, increase streak
        streakData.currentStreak += 1;
        streakData.highestStreak = Math.max(streakData.currentStreak, streakData.highestStreak);
      } else {
        // Streak broken, reset to 1
        streakData.currentStreak = 1;
      }
      
      // Update last login date
      streakData.lastLoginDate = todayStr;
    }
    
    // Update streak data in user document
    await updateDoc(userRef, { streak: streakData });
    return streakData;
  } catch (error) {
    console.error('Error updating streak:', error);
    return null;
  }
};

// Get user's current streak
export const getUserStreak = async (telegramId: string): Promise<StreakData | null> => {
  try {
    const userRef = doc(db, 'users', telegramId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.error('User not found in the database');
      return null;
    }
    
    const userData = userDoc.data();
    
    if (!userData.streak) {
      const defaultStreak: StreakData = {
        currentStreak: 0,
        highestStreak: 0,
        lastLoginDate: '',
        startDate: ''
      };
      return defaultStreak;
    }
    
    return userData.streak as StreakData;
  } catch (error) {
    console.error('Error getting streak:', error);
    return null;
  }
};

// Function to check if a user should be rewarded for reaching a streak milestone
export const checkStreakMilestones = async (telegramId: string): Promise<number | null | undefined> => {
  try {
    const streakData = await getUserStreak(telegramId);
    if (!streakData) return null;
    
    // Define milestone rewards (streak day => reward amount)
    const milestones: Record<number, number> = {
      7: 50,   // 7 days streak = 50 tokens
      30: 250, // 30 days streak = 250 tokens
      90: 1000 // 90 days streak = 1000 tokens
    };
    
    // Check if user has hit a milestone
    const userRef = doc(db, 'users', telegramId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    if (userData) {
      if (!userData.claimedMilestones) {
        userData.claimedMilestones = [];
      }
    
      for (const [days, reward] of Object.entries(milestones)) {
        const milestone = parseInt(days);
        if (streakData.currentStreak >= milestone && 
            !userData.claimedMilestones.includes(milestone)) {
          // User has reached a milestone they haven't claimed
          await updateDoc(userRef, {
            claimedMilestones: [...userData.claimedMilestones, milestone],
            balance: userData.balance + reward
          });
          
          return reward;
        }
      }
    } else {
      console.error('User data not found');
      return null;
    }
  } catch (error) {
    console.error('Error checking streak milestones:', error);
    return null;
  }
};
