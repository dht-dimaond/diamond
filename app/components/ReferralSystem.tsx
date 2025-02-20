import React, { useState, useEffect } from 'react';
import { getUserData, getUserReferrals, handleReferral, getReferrerData, getReferralsWithDetails } from '@/lib/users';
import { Share2, Copy, Users, Gift, User } from 'lucide-react';
import { UserData } from '@/types/telegram';





interface ReferralSystemProps {
  userId: string;
  startParam?: string;
  initData: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ userId, startParam, initData }) => {
  const [referrals, setReferrals] = useState<UserData[]>([]);
  const [referrer, setReferrer] = useState<UserData | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const INVITE_URL = "https://t.me/Diamondheistbot/DHT";

  useEffect(() => {
    const loadReferralData = async () => {
      try {
        setLoading(true);
        const userData = await getUserData(userId);
        
        if (userData) {
          const [referralsData, referrerData] = await Promise.all([
            getReferralsWithDetails(userId),
            userData.referrer ? getReferrerData(userId) : Promise.resolve(null)
          ]);
          
          // Now TypeScript knows these are UserData arrays/objects
          setReferrals(referralsData);
          setReferrer(referrerData);
        }

        if (startParam && !userData?.referrer) {
          await handleReferral(userId, startParam);
          // Refresh data after handling referral
          const newReferrer = await getReferrerData(userId);
          setReferrer(newReferrer);
        }
      } catch (error) {
        console.error('Error loading referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReferralData();
  }, [userId, startParam]);

  const handleInviteFriend = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    const shareText = '🎮 Join me in Diamond Heist! An exciting Telegram game where strategy meets adventure. Use my invite link to get started! 💎';
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(fullUrl);
  };

  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    navigator.clipboard.writeText(inviteLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-white/10 rounded-lg" />
          <div className="h-20 bg-white/10 rounded-lg" />
          <div className="h-40 bg-white/10 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full p-4 space-y-6">
      {/* Referrer Info */}
      {referrer && (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-800/50 p-4 border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-blue-500/10 animate-pulse" />
      <div className="relative flex items-center space-x-3">
        <User className="h-8 w-8 text-blue-400" />
        <div>
          <p className="font-semibold text-white mb-2 text-highlight">You were referred by:</p>
          <p className="font-semibold text-amber-400">
              @{referrer.username || 'anonymous'}
          </p>
          <p className="text-sm text-white/60">
            <p>Id: {referrer.telegramId && (referrer.telegramId.toString().slice(0, 3) + "*".repeat(referrer.telegramId.toString().length - 4) + referrer.telegramId.toString().slice(-1))}</p>
          </p>
          <p className="text-sm text-white/60">
            Joined : {new Date(referrer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )}

      {/* Invite Section */}
      <div className="rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Invite Friends</h2>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleInviteFriend}
            className="w-full group relative px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-800 hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
          >
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center space-x-2">
              <Share2 className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Share Invite Link</span>
            </div>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full group relative px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center space-x-2">
              <Copy className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">
                {showCopied ? 'Copied!' : 'Copy Invite Link'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Referrals Section */}
      <div className="rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Your Referrals</h2>
          </div>
          <span className="text-lg font-bold text-blue-400">{referrals.length}</span>
        </div>
        
        {referrals.length > 0 ? (
          <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.telegramId}
                  className="group relative overflow-hidden rounded-lg bg-white/5 px-6 py-4 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-purple-500/5 transition-all duration-300" />
                  <div className="relative flex justify-start space-x-2">
                   <User className="h-6 w-6 text-white/60" />
                    <div>
                     <p className="font-semibold text-white/80">
                      @{referral.username || 'anonymous'}
                        </p>
                        <p className="text-sm text-white/60">
                          <p>Id: {referral.telegramId && (referral.telegramId.toString().slice(0, 3) + "*".repeat(referral.telegramId.toString().length - 4) + referral.telegramId.toString().slice(-1))}</p>
                        </p>
                        <p className="text-sm text-white/60">
                          Joined : {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No referrals yet. Share your link to invite friends!</p>
          </div>
        )}
      </div>

      {/* Copied Notification */}
      {showCopied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-green-500/90 text-white backdrop-blur-lg shadow-lg animate-fade-in-up">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;