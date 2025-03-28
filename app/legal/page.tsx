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
      </div>
  );
};

export default LegalNotice; 
