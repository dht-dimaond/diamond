'use client';

import ProfileCard from '../components/ProfileCard';
import { useUser } from '@/context/UserContext';


const ProfilePage = () => {
  const { userData } = useUser()
  
  return ( 
    <div>
    {userData ? (
      <ProfileCard userData={userData} />
    ) : (
      <div>Loading...</div>
    )}
  </div>
   )
};

export default ProfilePage;