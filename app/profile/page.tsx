'use client';

import { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import { useUser } from '@/context/UserContext';
import { getUserData } from '@/lib/users'; 

const ProfilePage = () => {
  const { userData } = useUser()
  const [isAmbassador, setIsAmbassador] = useState(false);

  
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            
            if (!userData?.id) {
              console.error('User ID is missing');
              return;
            }
    
            const userId = userData.id.toString(); 
            const userFirestoreData = await getUserData(userId);
    
            if (userFirestoreData) {
              setIsAmbassador(userFirestoreData.isAmbassador);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
      }, [userData]); 
  return ( 
    <div className='p-6'>
        {isAmbassador && (
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-700/30 to-amber-600/10 border border-amber-600/50">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Ambassador 
              </h2>
              <p className="mt-2 text-amber-100/80 text-sm">
                Congratulations! You have successfully referred 10+ and achieved Ambassador status.
              </p>
            </div>
          </div>
        )}

    {userData ? (
      <ProfileCard userData={userData} />
    ) : (
      <div>Loading...</div>
    )}
  </div>
   )
};

export default ProfilePage;