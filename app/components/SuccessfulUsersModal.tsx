import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 

interface SuccessfulUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}


interface UserData {
  username: string;
  reward: string;
}

const SuccessfulUsersModal = ({ isOpen, onClose }: SuccessfulUsersModalProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async (): Promise<void> => {
        try {
          const querySnapshot = await getDocs(collection(db, "successfulUsers"));
          const userData: UserData[] = [];
          
          querySnapshot.forEach((doc) => {
          
            const data = doc.data();
            if (data.username && typeof data.username === 'string') {
              userData.push({ 
                username: data.username,
                reward: "500 DHT"
              });
            }
          });
          
          setUsers(userData);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching users:", err);
          setError("Failed to load users");
          setLoading(false);
        }
      };
      
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-amber-400">
            Successful Challenge Participants
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center p-4">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-gray-400 text-center p-4">No successful submissions yet</div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Congratulations to everyone who has successfully completed the TikTok challenge and received rewards!
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 tracking-wider">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 tracking-wider">
                        Reward
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : ''}>
                        <td className="px-4 py-3 text-sm text-white">
                          {user.username}
                        </td>
                        <td className="px-4 py-3 text-sm text-amber-400">
                          {user.reward}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulUsersModal;