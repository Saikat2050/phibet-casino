import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900/20 via-orange-900/30 to-red-900/20" 
         style={{
           backgroundColor: '#1a0f0a',
           backgroundImage: `
             radial-gradient(circle at 20% 50%, rgba(255, 140, 0, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 40% 80%, rgba(218, 165, 32, 0.05) 0%, transparent 50%)
           `
         }}>
      <div className="text-center">
        {/* Gaming Style Spinner */}
        <div className="w-16 h-16 border-4 border-yellow-900/30 border-t-orange-500 border-r-red-500 rounded-full animate-spin mx-auto mb-6 shadow-lg"></div>
        
        {/* Loading Text with Gaming Style */}
        <p className="text-orange-300 text-lg font-semibold tracking-wider animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;