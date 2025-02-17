import React, { useState, useEffect } from 'react'; // Import React and necessary hooks

// Define the props expected by the ReferralSystem component
interface ReferralSystemProps {
  initData: string; // Initial data string
  userId: string; // User ID
  startParam: string; // Start parameter for referral
}

// ReferralSystem functional component
const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
  // State variables to manage referrals, referrer, UI messages, loading, and errors
  const [referrals, setReferrals] = useState<string[]>([]); // State to store the list of referrals
  const [referrer, setReferrer] = useState<string | null>(null); // State to store referrer information
  const [showCopied, setShowCopied] = useState(false); // State to manage copy notification visibility
  const [loading, setLoading] = useState<boolean>(false); // State to handle loading state
  const [error, setError] = useState<string | null>(null); //cd State to store error messages

  // Base invite URL for referrals
  const INVITE_URL = "https://t.me/Diamondheistbot/DHT"; // Telegram invite URL
  console.log(initData); // Log initial data
  
  useEffect(() => {
    // Function to check and save a referral
    const checkReferral = async () => {
      if (userId && startParam) { // Ensure userId and startParam exist
        try {
          setLoading(true); // Set loading to true
          setError(null); // Reset error before trying
          const response = await fetch('/api/referrals', { // Send referral request to API
            method: 'POST', // Use POST method
            headers: { 'Content-Type': 'application/json' }, // Set request headers
            body: JSON.stringify({ userId, referrerId: startParam }), // Convert data to JSON
          });
          if (!response.ok) throw new Error('Failed to create referral'); // Handle response errors
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message); // Set error message
          } else {
            setError('An unknown error occurred'); // Fallback error message
          }
        } finally {
          setLoading(false); // Set loading to false
        }
      }
    };

    // Function to fetch the list of referrals for the user
    const fetchReferrals = async () => {
      if (userId) { // Ensure userId exists
        try {
          setLoading(true); // Set loading to true
          setError(null); // Reset error before trying
          const response = await fetch(`/api/referrals?userId=${userId}`); // Fetch referrals from API
          if (!response.ok) throw new Error('Failed to fetch referrals'); // Handle response errors
          const data = await response.json(); // Parse JSON response
          setReferrals(data.referrals || []); // Store referrals or empty array
          setReferrer(data.referrer || null); // Store referrer or null
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message); // Set error message
          } else {
            setError('An unknown error occurred'); // Fallback error message
          }
        } finally {
          setLoading(false); // Set loading to false
        }
      }
    };

    checkReferral(); // Check and save referral when component mounts
    fetchReferrals(); // Fetch referrals when component mounts
  }, [userId, startParam]); // Re-run effect when userId or startParam changes

  // Function to generate and share an invite link
  const handleInviteFriend = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`; // Create invite link
    const shareText = 'Join me on this awesome Telegram mini app! 🚀'; // Set invite message
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`; // Generate shareable URL
    window.open(fullUrl); // Open invite link in a new tab
  };

  // Function to copy the invite link to the clipboard
  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`; // Create invite link
    navigator.clipboard.writeText(inviteLink); // Copy invite link to clipboard
    setShowCopied(true); // Show copied confirmation
    setTimeout(() => setShowCopied(false), 2000); // Hide confirmation after 2 seconds
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6"> {/* Container with max width and padding */}
      {referrer && (
        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg mb-6"> {/* Referrer message box */}
          You were referred by user {referrer} {/* Display referrer ID */}
        </div>
      )}

      {loading && <p className="text-center text-lg font-semibold text-white-600">Loading...</p>} {/* Show loading text if loading */}

      {error && <p className="text-red-600">{error}</p>} {/* Show error message if any */}

      <div className="flex flex-col space-y-4"> {/* Buttons container */}
        <button
          onClick={handleInviteFriend} // Call invite function on click
          className="bg-indigo-700 hover:bg-indigo-900 text-white font-semibold py-3 px-6 rounded-full border-t transition-colors duration-200"
        >
          Invite Friend
        </button>

        <button
          onClick={handleCopyLink} // Call copy function on click
          className="backdrop-blur-lg bg-white/5 hover:bg-indigo-400 text-indigo font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          {showCopied ? 'Link Copied!' : 'Copy Invite Link'} {/* Change button text based on state */}
        </button>
      </div>

      <div className="mt-8"> {/* Referral list container */}
        <h2 className="text-xl font-bold mb-4">
          Your Referrals ({referrals.length}) {/* Display number of referrals */}
        </h2>
        {referrals.length > 0 ? (
          <div className="space-y-2"> {/* List referrals if available */}
            {referrals.map((referral, index) => (
              <div
                key={index} // Unique key for each referral
                className="backdrop-blur-lg bg-white/5 px-6 py-3 rounded-lg transition-colors duration-200"
              >
                User {referral} {/* Display referral ID */}
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-lg bg-white/5 text-white px-4 py-3 rounded-lg"> {/* Message if no referrals */}
            <p>You have no referrals.</p>
          </div>
        )}
      </div>

      {showCopied && (
        <div className="flex justify-center mt-4 backdrop-blur-lg bg-white/5 bg-opacity-75 text-white px-4 py-2 rounded-full"> {/* Copy notification */}
          Invite link copied!
        </div>
      )}
    </div>
  );
};

export default ReferralSystem; // Export component
