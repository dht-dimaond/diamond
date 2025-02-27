import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { saveUserData, handleReferral } from '@/lib/users';
import { TelegramUser } from '@/types/telegram';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        initData: string;
        initDataUnsafe: {
          user?: TelegramUser;
          start_param?: string;
          initData: string;
        };
      };
    };
  }
}

interface UserContextType {
  userData: TelegramUser | null;
  isLoading: boolean;
  start_param?: string;
  initData: string;
  referralProcessed: boolean;
}

const UserContext = createContext<UserContextType>({ 
  initData: '', 
  userData: null, 
  isLoading: true, 
  start_param: '',
  referralProcessed: false 
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [start_param, setStartParam] = useState('');
  const [initData, setInitData] = useState('');
  const [referralProcessed, setReferralProcessed] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSaveUserData = async () => {
      try {
        let user: TelegramUser;
        let startParam = '';
        let initDataStr = '';

        if (process.env.NODE_ENV === 'development') {
          // Simulating Telegram data for local testing
          user = {
            id: 12345,
            first_name: 'Olumide',
            last_name: 'David💎',
            username: 'Jagabanthaprince',
            language_code: 'en',
            is_premium: true,
            photo_url: 'https://randomuser.me/api/portraits/men/3.jpg',
          };
          startParam = '67890'; // Simulate a referrer ID
          initDataStr = 'simulated_init_data';
        } else {
          if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const webAppData = window.Telegram.WebApp.initDataUnsafe;

            if (webAppData.user) {
              user = webAppData.user;
              startParam = webAppData.start_param || '';
              initDataStr = webAppData.initData;
            } else {
              throw new Error('No user data available from Telegram WebApp');
            }
          } else {
            throw new Error('Telegram WebApp not available');
          }
        }

        // Saving user data to Firebase
        await saveUserData(user);

        // Processing referral if start_param exists
        if (startParam) {
          try {
            await handleReferral(user.id.toString(), startParam);
            setReferralProcessed(true);
          } catch (referralError) {
            console.error('Referral processing failed:', referralError);
            setReferralError('Failed to process referral');
            setReferralProcessed(false);
          }
        }

        // Set user data in context
        setUserData(user);
        setStartParam(startParam);
        setInitData(initDataStr);
      } catch (error) {
        console.error('Error fetching or saving user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSaveUserData();
  }, []);

  return (
    <UserContext.Provider value={{ 
      initData, 
      userData, 
      isLoading, 
      start_param,
      referralProcessed 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};