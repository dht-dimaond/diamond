import React from 'react';

interface AnimatedCoinsProps {
  isMining: boolean;
}

const AnimatedCoins: React.FC<AnimatedCoinsProps> = ({ isMining }) => {
  const backgroundCoins = Array(20).fill(null).map((_, i) => ({
    size: '80px',
    animationDelay: `${i * 0.2}s`,
  }));

  return (
    <div className="relative w-full aspect-square max-w-[800px] mx-auto mb-6 flex justify-center items-center">
   
    {/* Background coins that only show when mining */}
    {isMining &&
      backgroundCoins.map((coin, index) => (
        <img
          key={index}
          src="/coin.png"
          alt="Background DHT Token"
          className="absolute animate-simple-bounce opacity-30"
          style={{
            width: coin.size,
            height: coin.size,
            objectFit: 'contain',
            zIndex: 1,
            animationDelay: coin.animationDelay,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
  
    {/* Main coin */}
    <img
      src="/coin.png"
      alt="DHT Token"
      className={`relative z-10 ${isMining ? 'animate-spin-slow' : 'animate-float'}`}
      sizes="400px"
      style={{ objectFit: 'contain' }}
      width={600}
      height={800}
    />
  
    {isMining && (
      <img
        src="/coin.png"
        alt="DHT Token"
        className="z-10 animate-spin-counter"
        sizes="400px"
        style={{ objectFit: 'contain' }}
        width={600}
        height={800}
      />
    )}
  </div>
  
  );
};


export default AnimatedCoins;