import React from 'react';
import { ScanEye, History, Info, ArrowRight } from 'lucide-react';
import { DrishtiLogo } from './DrishtiLogo';

interface NavbarProps {
  activeTab: 'home' | 'analyze' | 'history' | 'about';
  setActiveTab: (tab: 'home' | 'analyze' | 'history' | 'about') => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <button
          id="nav-brand-btn"
          onClick={() => setActiveTab('home')}
          className="flex items-center text-left group focus:outline-none cursor-pointer"
          aria-label="Drishti Home"
        >
          <DrishtiLogo size="md" />
        </button>

        {/* Website Navigation Menu with spacious padding & crisp labels */}
        <nav className="hidden md:flex items-center gap-2 bg-[#F2ECE1] p-1.5 rounded-2xl border border-[#E3D8C7]">
          <button
            id="nav-home-link"
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                : 'text-[#524B3F] hover:text-[#1A1C20] hover:bg-[#EAE1D2]'
            }`}
          >
            Overview
          </button>

          <button
            id="nav-analyze-link"
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'analyze'
                ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                : 'text-[#524B3F] hover:text-[#1A1C20] hover:bg-[#EAE1D2]'
            }`}
          >
            <ScanEye className="w-4 h-4 text-[#FA8F79]" />
            <span>Studio</span>
          </button>

          <button
            id="nav-history-link"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                : 'text-[#524B3F] hover:text-[#1A1C20] hover:bg-[#EAE1D2]'
            }`}
          >
            <History className="w-4 h-4 text-[#818CF8]" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-2 py-0.5 bg-[#FA8F79] text-[#1A1C20] text-xs font-extrabold rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-about-link"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                : 'text-[#524B3F] hover:text-[#1A1C20] hover:bg-[#EAE1D2]'
            }`}
          >
            <Info className="w-4 h-4 text-[#34D399]" />
            <span>About</span>
          </button>
        </nav>

        {/* Primary Header Action CTA */}
        <div className="flex items-center gap-3">
          <button
            id="nav-scan-cta-btn"
            onClick={() => setActiveTab('analyze')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FA8F79] hover:bg-[#F97A62] text-[#1A1C20] font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Scan Space</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
