import React, { useState, useEffect } from 'react';
import { Shield, Zap, ArrowUpRight, CreditCard, Twitter, Send, Bell } from 'lucide-react';

const DHTWallet = () => {
  const [animationState, setAnimationState] = useState(0);
  const [isHovering, setIsHovering] = useState<number | null>(null);

  // Automatically cycle through feature card animations
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 4);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield size={22} className="text-cyan-400" />,
      title: 'Military-grade Security',
      description: 'Advanced encryption protocols to keep your assets safe.',
      color: 'cyan',
    },
    {
      icon: <Zap size={22} className="text-yellow-400" />,
      title: 'Lightning Transactions',
      description: 'Sub-second confirmation for seamless transfers.',
      color: 'yellow',
    },
    {
      icon: <ArrowUpRight size={22} className="text-green-400" />,
      title: 'Minimal Transaction Fees',
      description: 'Save on every transfer with our low-cost network.',
      color: 'green',
    },
    {
      icon: (
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold">
          DHT
        </div>
      ),
      title: 'Full DHT Token Support',
      description: 'Native integration for all $DHT transactions.',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-black text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
          <div className="flex items-center space-x-4 mb-8 md:mb-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-sm"></div>
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-0.5 relative">
                <div className="h-full w-full rounded-full bg-indigo-950 flex items-center justify-center">
                  <CreditCard size={24} className="text-blue-300" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">DHT Wallet</h3>
              <div className="flex items-center">
                <span className="text-blue-300 mr-2 text-sm">Coming Soon</span>
                <span className="inline-block h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all text-sm font-medium">
              Learn More
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium">
              Join Waitlist
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div>
            <div className="inline-block mb-3 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-blue-300">
              <span className="mr-2">⚡</span> Swap Your $DHT Tokens
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 inline-block text-transparent bg-clip-text">
                The Future of Digital Finance
              </span>
            </h1>
            <p className="text-blue-100 mb-8 text-lg leading-relaxed">
              Experience next-generation crypto management with unparalleled security and blazing speed. 
              Manage, swap, and grow your $DHT tokens effortlessly.
            </p>
            <div className="flex items-center space-x-3 mb-8">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-indigo-950"></div>
                <div className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-indigo-950"></div>
                <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-indigo-950"></div>
              </div>
              <div className="text-blue-200 text-sm">
                Join <span className="font-bold">1,200+</span> early adopters
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-indigo-900/50 to-black/50 border border-white/10 rounded-3xl p-6 backdrop-blur-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="text-sm text-blue-300">Current Balance</div>
                    <div className="text-2xl font-bold">1,250 DHT</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold">
                    DHT
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-blue-200">$DHT to ETH</span>
                    <span className="text-sm text-blue-300">0.00042 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-blue-400">1 DHT = 0.00042 ETH</span>
                    <Zap size={14} className="text-yellow-400" />
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                  Swap Tokens
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-blue-300 max-w-2xl mx-auto">
              DHT Wallet combines cutting-edge technology with intuitive design to provide the best experience for managing your digital assets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl transition-all duration-500 group 
                  ${animationState === index || isHovering === index
                    ? 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 scale-105'
                    : 'bg-white/5 hover:bg-gradient-to-r hover:from-blue-900/40 hover:to-indigo-900/40'
                  }`}
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div
                  className={`p-3 rounded-lg bg-${feature.color}-900/50 group-hover:bg-${feature.color}-800/70 transition-colors mb-4 inline-block`}
                >
                  {feature.icon}
                </div>
                <div>
                  <span className="text-white font-medium block text-lg mb-2">{feature.title}</span>
                  <span className="text-blue-300 text-sm block">{feature.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10 mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Be Among the First</h3>
            <p className="text-blue-200 mb-8">
              Join our exclusive waitlist to get early access to DHT Wallet and receive special benefits when we launch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:border-blue-400 text-white w-full sm:w-auto"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all w-full sm:w-auto">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-0.5">
                <div className="h-full w-full rounded-full bg-indigo-950 flex items-center justify-center">
                  <CreditCard size={14} className="text-blue-300" />
                </div>
              </div>
              <span className="text-white font-bold">DHT Wallet</span>
            </div>
            <p className="text-blue-300 text-sm">The future of digital finance, today.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-300 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors">
              <Send size={20} />
            </a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors">
              <Bell size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DHTWallet;