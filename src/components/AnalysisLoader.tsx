import React, { useState, useEffect } from 'react';
import { ScanSearch, ScanEye, Eye, Layers, Compass, CheckCircle2 } from 'lucide-react';

const ANALYSIS_STAGES = [
  { text: 'Scanning visual structure...', icon: ScanSearch, color: '#FA8F79' },
  { text: 'Detecting accessibility signals...', icon: ScanEye, color: '#FBBF24' },
  { text: 'Examining pathways & clearances...', icon: Compass, color: '#34D399' },
  { text: 'Reviewing contrast & signage...', icon: Eye, color: '#818CF8' },
  { text: 'Evaluating selected lenses...', icon: Layers, color: '#EC4899' },
  { text: 'Generating actionable audit...', icon: CheckCircle2, color: '#2DD4BF' },
];

interface AnalysisLoaderProps {
  imagePreview?: string | null;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ imagePreview }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev + 1) % ANALYSIS_STAGES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const currentStage = ANALYSIS_STAGES[currentStageIdx];
  const IconComponent = currentStage.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">
        {/* Animated Visual Scan Area */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl overflow-hidden bg-[#EFE8DC] border-2 border-[#E0D5C1] shadow-inner flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Space under analysis"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 filter blur-[0.5px]"
            />
          ) : (
            <div className="w-full h-full bg-[#EBE2D3] flex items-center justify-center">
              <ScanSearch className="w-12 h-12 text-[#9E9584] animate-pulse" />
            </div>
          )}

          {/* Animated Scanning Beam */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FA8F79]/30 to-transparent h-14 w-full animate-[scan_2.2s_ease-in-out_infinite] pointer-events-none"></div>

          {/* Center Pulsing Lens Icon */}
          <div className="absolute w-14 h-14 rounded-2xl bg-[#1A1C20]/90 text-[#FAF6EE] flex items-center justify-center shadow-lg backdrop-blur-xs transition-transform duration-300 transform scale-105">
            <IconComponent
              className="w-7 h-7 transition-colors duration-300"
              style={{ color: currentStage.color }}
            />
          </div>

          {/* Corner Viewfinder Marks */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FA8F79]"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FA8F79]"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FA8F79]"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FA8F79]"></div>
        </div>

        {/* Status Stage Text */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#8C5D50]">
            Analyzing image
          </span>

          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#1A1C20] tracking-tight">
            {currentStage.text}
          </h2>

          <p className="text-xs sm:text-sm text-[#736D61] max-w-md mx-auto">
            Evaluating physical barriers, sensory considerations, and practical improvements through selected accessibility lenses.
          </p>
        </div>

        {/* Step Progression Pills */}
        <div className="flex justify-center items-center gap-1.5 pt-2">
          {ANALYSIS_STAGES.map((stage, idx) => (
            <div
              key={stage.text}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStageIdx
                  ? 'w-7 bg-[#FA8F79]'
                  : idx < currentStageIdx
                  ? 'w-3 bg-[#34D399]'
                  : 'w-2 bg-[#DDD4C3]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
