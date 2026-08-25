import React from 'react';
import { Home, ScanSearch, History, Info } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'analyze' | 'history' | 'about';
  setActiveTab: (tab: 'home' | 'analyze' | 'history' | 'about') => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-4 left-0 right-0 z-40 px-6 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto bg-[#1A1C20] text-[#FAF6EE] px-4 py-2.5 rounded-full shadow-xl flex items-center gap-4 sm:gap-6 border border-[#30333A]/80">
        <button
          id="bottom-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-full transition-colors ${
            activeTab === 'home'
              ? 'text-[#FAF6EE] bg-[#2E313A]'
              : 'text-[#9CA3AF] hover:text-[#FAF6EE]'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          id="bottom-nav-analyze"
          onClick={() => setActiveTab('analyze')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
            activeTab === 'analyze'
              ? 'bg-[#FA8F79] text-[#1A1C20] shadow-md'
              : 'text-[#FAF6EE] bg-[#2E313A] hover:bg-[#383C47]'
          }`}
          aria-label="Analyze"
        >
          <ScanSearch className="w-4 h-4" />
          <span>Analyze</span>
        </button>

        <button
          id="bottom-nav-history"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-full transition-colors relative ${
            activeTab === 'history'
              ? 'text-[#FAF6EE] bg-[#2E313A]'
              : 'text-[#9CA3AF] hover:text-[#FAF6EE]'
          }`}
          aria-label="History"
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-medium">History</span>
          {savedCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#818CF8] rounded-full border-2 border-[#1A1C20]"></span>
          )}
        </button>

        <button
          id="bottom-nav-about"
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-full transition-colors ${
            activeTab === 'about'
              ? 'text-[#FAF6EE] bg-[#2E313A]'
              : 'text-[#9CA3AF] hover:text-[#FAF6EE]'
          }`}
          aria-label="About and Legal"
        >
          <Info className="w-5 h-5" />
          <span className="text-[10px] font-medium">About</span>
        </button>
      </div>
    </nav>
  );
};
