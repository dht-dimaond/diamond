'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { getUserData, getUserReferrals, completeSocialMission, claimMissionReward } from '@/lib/users';
import Link from 'next/link';

const MissionsPage = () => {
  const { userData } = useUser();
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [grandPrizeRewardClaimed, setGrandPrizeRewardClaimed] = useState(false);
  const [missions, setMissions] = useState({
    twitter: { completed: false, claimed: false },
    telegram: { completed: false, claimed: false },
    diamondlastname: { completed: false, claimed: false },
    referral: { claimed: false }
  });


   
   const hasDiamondInlastname = () => {
    if (!userData?.last_name) return false;
    return userData.last_name.includes('💎');
  };

  useEffect(() => {
    const loadData = async () => {
      if (!userData?.id) return;

      try {
        setLoading(true);
        const userDoc = await getUserData(userData.id.toString());
        
        if (!userDoc) return;

        // Getting referrals using getUserReferrals
        const referrals = await getUserReferrals(userData.id.toString());

        const diamondCompleted = hasDiamondInlastname(); // <-- This was missing
        
        setMissions(prev =>({
          ...prev,
          diamondlastname: {
            completed: diamondCompleted || userDoc.diamondlastnameComplete,
            claimed: userDoc.diamondlastnameRewardClaimed
          },
          twitter: {
            completed: userDoc.twitterComplete,
            claimed: userDoc.twitterRewardClaimed
          },
          telegram: {
            completed: userDoc.telegramComplete,
            claimed: userDoc.telegramRewardClaimed
          },
          referral: {
            claimed: userDoc.referralRewardClaimed
          }
        }));

        // Sync with Firebase if needed
        if (diamondCompleted && !userDoc.diamondlastnameComplete) {
          await completeSocialMission(userData.id.toString(), 'diamondlastname');
        }

        
        setReferralCount(referrals.length);
        
        // Set ambassador status and grand prize claim status
        setIsAmbassador(userDoc.isAmbassador || false);
        setGrandPrizeRewardClaimed(userDoc.grandPrizeRewardClaimed || false);
      } catch (error) {
        console.error('Error loading mission data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userData]);

  const handleSocialMission = async (platform: 'twitter' | 'telegram') => {
    if (!userData?.id) return;

    try {
      await completeSocialMission(userData.id.toString(), platform);
      
      setMissions(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          completed: true
        }
      }));
    } catch (error) {
      console.error(`Error completing ${platform} mission:`, error);
    }
  };

  const handleClaimReward = async (type: 'twitter' | 'telegram' | 'referral' | 'diamondlastname') => {
    if (!userData?.id) return;
    
    if (type === 'referral' && referralCount < 5) return;
    
    if ((type === 'twitter' || type === 'telegram') && !missions[type].completed) return;
    
    try {
      const amount = type === 'diamondlastname' ? 200 : 50; 
      await claimMissionReward(userData.id.toString(), type, amount);
    
      
      setMissions(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          claimed: true
        }
      }));
      alert(`You have claimed your ${type} reward!`);
    } catch (error) {
      console.error(`Error claiming ${type} reward:`, error);
    }
  };

  const handleClaimGrandPrize = async () => {
    if (!userData?.id || referralCount < 10 || grandPrizeRewardClaimed) return;
    
    try {
      // Using existing claimMissionReward function with a special type
      await claimMissionReward(userData.id.toString(), 'grandPrize', 1000, { isAmbassador: true });
      
      // Update local state
      setIsAmbassador(true);
      setGrandPrizeRewardClaimed(true);
      
      alert('Congratulations! You are now an Ambassador and have claimed 1000 DHT!');
    } catch (error) {
      console.error('Error claiming ambassador reward:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-gray-400">Loading missions...</p>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Grand Prize Section */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-amber-900/30 to-amber-800/10 border border-amber-800/50">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              GRAND PRICE: $1000 DHT
            </h2>
            <p className="mt-2 text-amber-100/80">Invite 10 friends to claim prize and unlock the ambassador badge.</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500 " 
                  style={{ width: `${Math.min((referralCount/10)*100, 100)}%` }}

                />
              </div>
              <span className="text-sm font-mono text-amber-200">
                {referralCount}/10
              </span>
            </div>
            
            {referralCount >= 10 && !grandPrizeRewardClaimed && (
              <button
                onClick={handleClaimGrandPrize}
                className="mt-4 px-6 py-2 overflow-hidden font-semibold text-white text-sm transition-all duration-300 rounded-lg cursor-pointer bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 animate-pulse"
              >
                Claim Ambassador Status & 1000 DHT
              </button>
            )}
          </div>
        </div>
        
        {/* Ambassador Badge - only shown when isAmbassador is true */}
        {isAmbassador && (
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-amber-700/30 to-amber-600/10 border border-amber-600/50">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Ambassador Status Achieved!
              </h2>
              <p className="mt-2 text-amber-100/80">
                Congratulations! You have successfully referred 10+ friends and claimed your 1000 DHT reward.
              </p>
            </div>
          </div>
        )}

        {/* Missions Grid */}
        <div className="gap-6 flex flex-col border-2 border-gray-700 rounded-xl p-4 shadow-xl bg-gradient-to-b from-gray-900/80 to-black/50">
          {/* Referral Mission Card */}
          <div className=" rounded-xl p-6 border border-gray-700/50 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-1000 rounded-lg backdrop-blur-md shadow-md w-full max-w-full">
            <div className="flex flex-col w-full max-w-full gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-amber-400">Invite Friends</h3>
                <span className="px-3 py-1 text-sm rounded-full bg-amber-900/30 text-amber-400">
                  +100 DHT
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    Invited: {referralCount} friends
                  </p>
                  <div className="h-1 bg-gray-800 rounded-full">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500 rounded-full" 
                      style={{ width: `${Math.min((referralCount/5)*100, 100)}%` }}

                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-wrap">
                  <Link
                    href="/invite"
                    className="flex-1 px-4 py-2 text-center rounded-lg bg-gradient-to-r from-blue-400 to-amber-600 animate-pulse shadow-lg shadow-blue-500/50 animate-pulse"
                  >
                    Invite
                  </Link>
                  <button
                    onClick={() => handleClaimReward('referral')}
                    disabled={referralCount < 5 || missions.referral.claimed}
                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
                  >
                    {missions.referral.claimed ? 'Claimed' : 'Claim Reward'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Mission Cards */}
          {[
            { type: 'telegram' as const, url: 'https://t.me/+PMWu-iBnsGg2NDM0', label: 'Join Telegram Channel' },
            { type: 'twitter' as const, url: 'https://x.com/diamondhiest?s=11', label: 'Follow us on X' }
          ].map(({ type, url, label }) => (
            <div key={type} className="bg-gradient-to-b from-gray-800 border-2 border-gray-700 via-gray-800 to-gray-1000 rounded-lg py-6 px-4 backdrop-blur-md shadow-md w-full max-w-full">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg space-x-2 font-semibold text-white">
                    {label}  
                    <span className="text-sm rounded-full bg-amber-800/30 text-amber-400">
                      +50 DHT
                    </span>
                  </h3>
                 
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      Status: {missions[type].completed ? 'Joined' : 'Pending'}
                    </span>
                    {missions[type].completed && !missions[type].claimed && (
                      <span className="text-amber-400 animate-pulse">Reward Ready!</span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        window.open(url, '_blank');
                        handleSocialMission(type);
                      }}
                      disabled={missions[type].completed}
                      className={`flex-1 px-4 py-2 overflow-hidden font-semibold text-white text-sm transition-all duration-300 rounded-lg cursor-pointer ${
                        (missions[type].completed)
                          ? 'bg-gray-800 text-gray-500 ring-offset-gray-200 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-400 to-amber-800 animate-pulse shadow-lg shadow-blue-500/50 animate-pulse'
                      } ease focus:outline-none`}
                    >
                      {missions[type].completed ? 'Completed' : 'Join Now'}
                    </button>
                    <button
                      onClick={() => handleClaimReward(type)}
                      disabled={!missions[type].completed || missions[type].claimed}
                      className={`flex-1 px-4 py-2 overflow-hidden font-semibold text-white text-sm transition-all duration-300 rounded-lg cursor-pointer ${
                        (!missions[type].completed || missions[type].claimed)
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse shadow-lg shadow-green-500/50 animate-pulse'
                      } ease focus:outline-none`}
                    >
                      {missions[type].claimed ? 'Claimed' : 'Claim'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
              {/* Diamond Username Mission */}
              <div className="bg-gradient-to-b from-gray-800 border-2 border-gray-700 via-gray-800 to-gray-1000 rounded-lg py-6 px-4 backdrop-blur-md shadow-md w-full max-w-full">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg space-x-2 font-semibold text-white">
                      Add the💎 emoji to your Lastname
                      <span className=" text-sm rounded-full bg-purple-800/30 text-purple-400">
                        +200 DHT
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        {missions.diamondlastname.completed 
                          ? `Current Name: @${userData?.first_name} ${userData?.last_name}`
                          : 'Add 💎 to your Telegram Lastname'}
                      </span>
                      {missions.diamondlastname.completed && !missions.diamondlastname.claimed && (
                        <span className="text-purple-400 animate-pulse">Reward Ready!</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex-1 px-4 py-2 text-gray-300 text-sm">
                        {missions.diamondlastname.completed 
                          ? 'Diamond 💎 Emoji in Lastname detected!'
                          : '1. Add 💎 to your Lastname.\n2. Restart the app'}
                      </div>
                      <button
                        onClick={() => handleClaimReward('diamondlastname')}
                        disabled={!missions.diamondlastname.completed || missions.diamondlastname.claimed}
                        className={`flex-1 px-4 py-2 overflow-hidden font-semibold text-white text-sm transition-all duration-300 rounded-lg cursor-pointer ${
                          (!missions.diamondlastname.completed || missions.diamondlastname.claimed)
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600 animate-pulse'
                        }`}
                      >
                        {missions.diamondlastname.claimed ? 'Claimed' : 'Claim'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

        </div>
      </div>
    </div>
  );
};

export default MissionsPage;