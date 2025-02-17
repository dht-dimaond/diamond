import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { saveUserData } from '@/lib/users';
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
}

const UserContext = createContext<UserContextType>({ initData: '', userData: null, isLoading: true, start_param: '' });

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [start_param, setStartParam] = useState('');
  const [initData, setInitData] = useState('');

  useEffect(() => {
    const fetchAndSaveUserData = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          // Simulate Telegram data for local testing
          const simulatedUser: TelegramUser = {
            id: 12345,
            first_name: 'Olumide',
            last_name: 'David',
            username: 'Jagabanthaprince',
            language_code: 'en',
            is_premium: true,
            photo_url: 'https://randomuser.me/api/portraits/men/3.jpg',
          };
          const simulatedStartParam = '67890'; // Simulate a referrer ID
          const simulatedInitData = 'simulated_init_data';

          // Save simulated user data to Firebase
          await saveUserData(simulatedUser);

          // Set simulated data in context
          setUserData(simulatedUser);
          setStartParam(simulatedStartParam);
          setInitData(simulatedInitData);
        } else {
          // Fetch real data from Telegram (for production)
          if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const webAppData = window.Telegram.WebApp.initDataUnsafe;

            if (webAppData.user) {
              // Save user data to Firebase
              await saveUserData(webAppData.user);

              // Set user data in context
              setUserData(webAppData.user);
              setStartParam(webAppData.start_param || '');
              setInitData(webAppData.initData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching or saving user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSaveUserData();
  }, []);

  return (
    <UserContext.Provider value={{ initData, userData, isLoading, start_param }}>
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