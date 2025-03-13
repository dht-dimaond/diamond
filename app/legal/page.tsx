'use client'
import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const LegalNotice = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>

      <button
        onClick={toggleDarkMode}
        className={`fixed top-24 right-4 p-3 rounded-full 
          ${isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-gray-200 hover:bg-gray-300'
          } 
          transition-colors duration-200`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
            <Sun className="w-6 h-6" />
          
        ) : (
            <Moon className="w-6 h-6" />
        )}
      </button>

      <div className="p-4 md:p-8">
        <div className={`max-w-4xl mx-auto p-6 md:p-8 space-y-6 rounded-lg shadow-lg
          ${isDarkMode 
            ? 'bg-gray-900 text-gray-100' 
            : 'bg-white text-black'
          } transition-colors duration-200`}>
          <div className="space-y-6">

            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
              NOTICE OF LEGAL COMPLIANCE AND RISK DISCLOSURE FOR THE DIAMOND HEIST PROJECT
            </h1>

            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
              To all users and participants of The Diamond Heist project, a cryptocurrency mining platform operating as a Telegram mini app,
            </p>

            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
              PLEASE BE ADVISED that The Diamond Heist project has undergone review and certification by the USA government, confirming its compliance with all applicable legal regulations. Specifically, the project adheres to anti-money laundering (AML) and know your customer (KYC) requirements, ensuring a secure and transparent environment for all users.
            </p>

            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
              The Diamond Heist project offers users various opportunities to earn $DHT tokens through participation in activities within the platform. The project prioritizes transparency and community engagement, fostering a trustworthy and inclusive ecosystem for all participants.
            </p>

            <div className="space-y-4">
              <p className="font-semibold">
                BY PARTICIPATING IN THE DIAMOND HEIST PROJECT, YOU ACKNOWLEDGE THAT YOU ARE AWARE OF THE FOLLOWING:
              </p>

              <ol className={`list-decimal pl-6 space-y-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-800'
              }`}>
                <li><span className="font-semibold">Certification:</span> The Diamond Heist project has been certified by the USA government, confirming its legitimacy and compliance with regulatory requirements.</li>
                <li><span className="font-semibold">AML and KYC Compliance:</span> The project adheres to strict AML and KYC standards, ensuring the integrity of all transactions and user interactions.</li>
                <li><span className="font-semibold">Token Earning Opportunities:</span> Users can earn $DHT tokens through various activities within the platform.</li>
                <li><span className="font-semibold">Transparency and Community Engagement:</span> The project prioritizes transparency and community engagement, providing regular updates and fostering a collaborative environment.</li>
                <li><span className="font-semibold">Risk Disclosure:</span> Cryptocurrency investments carry inherent risks, including market volatility, security risks, and potential losses. Users are advised to exercise caution and thoroughly understand these risks before participating in the project.</li>
              </ol>
            </div>

            <p className="font-semibold">
              BY USING THE DIAMOND HEIST PROJECT, YOU CONFIRM THAT YOU HAVE READ, UNDERSTAND, AND AGREE TO THESE TERMS AND CONDITIONS. YOU ALSO ACKNOWLEDGE THAT YOU ARE AWARE OF THE POTENTIAL RISKS ASSOCIATED WITH CRYPTOCURRENCY INVESTMENTS AND PARTICIPATE AT YOUR OWN RISK.
            </p>

            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
              The Diamond Heist project encourages responsible participation and adherence to all applicable laws and regulations. If you have any questions or concerns regarding the project or its compliance with regulatory requirements, please do not hesitate to reach out to our support team.
            </p>

            <div className="space-y-2 pt-4">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>Thank you for your participation in The Diamond Heist project.</p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>Sincerely,</p>
              <p className="font-semibold">The Diamond Heist Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;