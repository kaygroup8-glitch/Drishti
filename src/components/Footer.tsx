import React from 'react';
import { ScanEye, Bot } from 'lucide-react';
import { DrishtiLogo } from './DrishtiLogo';

interface FooterProps {
  onNavigate: (tab: 'home' | 'analyze' | 'agent' | 'history' | 'about') => void;
  onOpenAgentModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAgentModal }) => {
  return (
    <footer className="border-t border-[#EAE2D4] bg-[#F7F2E9] mt-auto text-[#635C4E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Mission Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <DrishtiLogo size="md" />
            <p className="text-sm text-[#6E6759] max-w-sm leading-relaxed">
              Drishti (दृष्टि) helps creators, designers, and facility owners reveal accessibility barriers beyond their own perspective.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#594E3C] bg-[#ECE5D8] px-3.5 py-1.5 rounded-full border border-[#DDD4C3]">
              <ScanEye className="w-3.5 h-3.5 text-[#FA8F79]" />
              <span>Universal Accessibility</span>
            </div>
          </div>

          {/* Navigation Links Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1C20]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#1A1C20] transition-colors cursor-pointer"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analyze')}
                  className="hover:text-[#1A1C20] transition-colors cursor-pointer"
                >
                  Vision Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('agent')}
                  className="hover:text-[#1A1C20] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-[#FA8F79]" />
                  <span>Drishti Agent</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-[#1A1C20] transition-colors cursor-pointer"
                >
                  Saved Audits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#1A1C20] transition-colors cursor-pointer"
                >
                  About & Principles
                </button>
              </li>
              {onOpenAgentModal && (
                <li>
                  <button
                    onClick={onOpenAgentModal}
                    className="hover:text-[#1A1C20] transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-[#787163]"
                  >
                    <span>WebMCP Protocol Details</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Governance & Ethics (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1C20]">
              Ethics & Community
            </h4>
            <p className="text-xs sm:text-sm text-[#736C5E] leading-relaxed">
              Drishti expands accessibility awareness. It does not replace certified ADA/WCAG compliance audits or lived-experience consultation.
            </p>
            <div className="pt-1 flex flex-wrap gap-4 text-xs font-semibold text-[#575043]">
              <button
                onClick={() => onNavigate('about')}
                className="hover:text-[#1A1C20] underline transition-colors cursor-pointer"
              >
                Terms
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="hover:text-[#1A1C20] underline transition-colors cursor-pointer"
              >
                Privacy
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E8DEC9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8274]">
          <p>© {new Date().getFullYear()} Drishti. Universal Design Intelligence.</p>
          <div className="flex items-center gap-1.5">
            <span>Powered by Gemini Multimodal Vision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
