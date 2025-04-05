import React, { useState, useEffect } from 'react';
import SuccessfulUsersModal from './SuccessfulUsersModal';

const  VideoMission = () => {
  const [videoLink, setVideoLink] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const challengeVideoUrl = "https://drive.google.com/uc?export=download&id=1sN6CceMjLCeBtNzkUZMcGLQogs1LljWM";
  
  
  const telegramChatLink = "https://t.me/Jagabanthaprince"; 
  
  
  useEffect(() => {
    const hasCompleted = localStorage.getItem('Mission Completed');
    if (hasCompleted === 'true') {
      setAlreadyCompleted(true);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoLink.trim()) {
      
      localStorage.setItem('videoSubmission', videoLink);
      
    
      localStorage.setItem('videoChallengeCompleted', 'true');
      
      setSubmitted(true);
      setAlreadyCompleted(true);
    }
  };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="rounded-xl p-6 border border-gray-700/50 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-1000 rounded-lg backdrop-blur-md shadow-md w-full max-w-full">
        <div className="flex flex-col w-full max-w-full gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-amber-400">Video Mission</h3>
            {alreadyCompleted ? (
              <span className="px-3 py-1 text-sm rounded-full bg-green-900/30 text-green-400">
                Completed
              </span>
            ) : (
              <span className="px-3 py-1 text-sm rounded-full bg-amber-900/30 text-amber-400">
                +500 DHT
              </span>
            )}
          </div>
          
          {alreadyCompleted && !submitted ? (
            <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-center">
              <div className="text-green-400 text-xl mb-2">✅ Challenge Complete</div>
              <p className="text-gray-300 text-sm">
                You&apos;ve already completed this challenge. Thank you for participating!
              </p>

            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Complete this challenge to earn rewards! Post our video on social media and share your link below.
              </p>
              
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                <h4 className="text-amber-400 font-medium mb-2">How to participate:</h4>
                <ol className="text-gray-300 text-sm space-y-2 list-decimal ml-4">
                  <li>Download our challenge video</li>
                  <li>Post it on your social media platform</li>
                  <li>Submit the video link below</li>
                  <li>Send your link via Telegram to claim your reward!</li>
                </ol>
              </div>
              
              <div className="flex flex-col gap-3">
                <a 
                  href={challengeVideoUrl} 
                  download 
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5z" />
                  </svg>
                  Download Mission Video
                </a>
              </div>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col">
                    <label className="text-gray-300 text-sm mb-1">Your Video URL</label>
                    <input 
                      type="url" 
                      placeholder="ex : https://www.tiktok.com/@username/video/1234567890" 
                      className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg transition-colors text-white font-medium"
                  >
                    Submit & Continue
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-center">
                    <div className="text-green-400 text-xl mb-2">🎉 Almost Done!</div>
                    <p className="text-gray-300 text-sm">
                      Now send your TikTok link via Telegram to claim your reward.
                    </p>
                  </div>
                  
                  <a 
                    href={telegramChatLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white font-medium"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm2.252 10.095l-3.397 3.398a.25.25 0 0 1-.354 0l-3.948-3.949a.25.25 0 0 1 0-.354l1.06-1.06a.25.25 0 0 1 .354 0l2.534 2.533a.75.75 0 0 0 1.06 0l6.718-6.719a.25.25 0 0 1 .354 0l1.06 1.06a.25.25 0 0 1 0 .354l-5.441 5.44z"/>
                    </svg>
                    Chat on Telegram to Claim Your Reward
                  </a>
                  
                  <button
                    onClick={() => {

                      navigator.clipboard.writeText(videoLink);
                      alert('TikTok link copied to clipboard!');
                    }}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium"
                  >
                    Copy Your video Link
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Successful participants modal button */}
          <button
            onClick={openModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Successful Participants
          </button>
        </div>
      </div>

      {/* Successful Users Modal */}
      <SuccessfulUsersModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default VideoMission;