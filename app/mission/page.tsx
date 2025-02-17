'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { getReferrals } from '@/lib/referralService';
import { getUserData, completeSocialMission, claimMissionReward } from '@/lib/users';
import Link from 'next/link';

const MissionsPage = () => {
  const { userData } = useUser();
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState({
    twitter: { completed: false, claimed: false },
    telegram: { completed: false, claimed: false },
    referral: { claimed: false }
  });

  useEffect(() => {
    const loadData = async () => {
      if (!userData?.id) return;

      try {
        setLoading(true);
        const userDoc = await getUserData(userData.id.toString());
        
        if (!userDoc) return;

        const referrals = await getReferrals(userData.id.toString());
        
        setMissions({
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
        });
        
        setReferralCount(referrals.length);
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

  const handleClaimReward = async (type: 'twitter' | 'telegram' | 'referral') => {
    if (!userData?.id) return;
    
    if (type === 'referral' && referralCount < 5) return;
    
    if ((type === 'twitter' || type === 'telegram') && !missions[type].completed) return;
    
    try {
      await claimMissionReward(userData.id.toString(), type, 100);
      
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

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-gray-400">Loading missions...</p>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Grand Prize Section */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-900/30 to-amber-800/10 border border-amber-800/50">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Promo Prize: $1000 DHT
            </h2>
            <p className="mt-2 text-amber-100/80">Invite 10 friends to unlock and get the ambasador badge.</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500 " 
                  style={{ width: `${(referralCount/10)*100}%` }}
                />
              </div>
              <span className="text-sm font-mono text-amber-200">
                {referralCount}/10
              </span>
            </div>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid gap-6 md:grid-cols-2 border-2 border-gray-700 rounded-xl p-6 shadow-xl bg-gradient-to-b from-gray-900/80 to-black/50">
          {/* Referral Mission Card */}
          <div className="col-span-full rounded-xl p-6 border border-gray-700/50 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-1000 rounded-lg backdrop-blur-md shadow-md w-full max-w-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-amber-400">Invite Friends</h3>
                <span className="px-3 py-1 text-sm rounded-full bg-amber-900/30 text-amber-400">
                  100 DHT
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
                      style={{ width: `${(referralCount/5)*100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/invite"
                    className="flex-1 px-4 py-2 text-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse shadow-lg shadow-green-500/50 animate-pulse"
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
            { type: 'telegram' as const, url: 'https://t.me/+PMWu-iBnsGg2NDM0', label: 'Join Our Telegram Channel' },
            { type: 'twitter' as const, url: 'https://x.com/diamondhiest?s=11', label: 'Follow us on(X) Twitter' }
          ].map(({ type, url, label }) => (
            <div key={type} className="bg-gradient-to-b from-gray-800 border-2 border-gray-700 via-gray-800 to-gray-1000 rounded-lg p-6 backdrop-blur-md shadow-md w-full max-w-md">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  <span className="px-3 py-1 text-sm rounded-full bg-amber-900/30 text-white">
                    100 $DHT
                  </span>
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
                          : 'bg-gradient-to-r from-blue-400 to-blue-800 animate-pulse shadow-lg shadow-blue-500/50 animate-pulse'
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
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;