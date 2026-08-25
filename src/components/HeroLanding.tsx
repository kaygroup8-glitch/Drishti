import React from 'react';
import {
  ScanEye,
  Eye,
  Compass,
  Wrench,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Footprints,
  Brain,
  Ear,
  Heart,
  Baby
} from 'lucide-react';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { SampleScenario } from '../types';

interface HeroLandingProps {
  onStartAnalysis: () => void;
  onSelectSample: (scenario: SampleScenario) => void;
  onOpenAbout: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartAnalysis,
  onSelectSample,
  onOpenAbout,
}) => {
  const lensesList = [
    {
      icon: Footprints,
      color: 'bg-[#FFEBE5] text-[#FA8F79] border-[#FFD5CC]',
      title: 'Mobility & Steps',
      desc: 'Detects stepped thresholds, steep grades, and missing ramps.',
    },
    {
      icon: Eye,
      color: 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
      title: 'Low Vision & Contrast',
      desc: 'Highlights low-contrast edges, poor lighting, and illegible signs.',
    },
    {
      icon: Ear,
      color: 'bg-[#EEF2FF] text-[#6366F1] border-[#C7D2FE]',
      title: 'Hearing & Visual Cues',
      desc: 'Checks visual emergency cues and redundant indicators.',
    },
    {
      icon: Brain,
      color: 'bg-[#FDF4FF] text-[#C026D3] border-[#F5D0FE]',
      title: 'Cognition & Wayfinding',
      desc: 'Assesses visual flow, clutter, and clear signage.',
    },
    {
      icon: Heart,
      color: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
      title: 'Elderly Friendly',
      desc: 'Reviews continuous handrails, rest spots, and slip hazards.',
    },
    {
      icon: Baby,
      color: 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]',
      title: 'Stroller & Reach',
      desc: 'Evaluates lower reach zones and stroller passage clearance.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 max-w-7xl mx-auto px-6 sm:px-12">
      {/* 1. HERO SECTION */}
      <section className="pt-10 sm:pt-16 text-center max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-[#1A1C20] tracking-tight leading-[1.08]">
            See beyond your own perspective.
          </h1>
          <p className="text-lg sm:text-xl text-[#5E574B] max-w-2xl mx-auto font-normal leading-relaxed">
            Drishti uses multimodal vision to reveal hidden physical and sensory accessibility barriers in real-world spaces.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-analyze-cta"
            onClick={onStartAnalysis}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#1A1C20] hover:bg-[#2C2E35] text-[#FAF6EE] font-bold text-base shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ScanEye className="w-5 h-5 text-[#FA8F79]" />
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
          </button>

          <button
            id="hero-how-it-works-link"
            onClick={onOpenAbout}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#EFE8DC] hover:bg-[#E5DCCE] text-[#423D33] font-bold text-sm transition-colors border border-[#DDD3C2] cursor-pointer"
          >
            <span>Principles & Legal</span>
            <ChevronRight className="w-4 h-4 text-[#736C5F]" />
          </button>
        </div>
      </section>

      {/* 2. THREE-STEP PROCESS */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FA8F79]">
            Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1C20]">
            How Drishti Evaluates Spaces
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[#FAF7F0] border border-[#E8DEC8] p-8 sm:p-10 rounded-3xl space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEBE5] text-[#FA8F79] flex items-center justify-center font-bold font-heading text-lg">
              1
            </div>
            <h3 className="text-xl font-bold font-heading text-[#1A1C20]">
              Capture Space
            </h3>
            <p className="text-sm text-[#665F52] leading-relaxed">
              Upload a photo of an entrance, steps, corridor, restroom, or signage.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FAF7F0] border border-[#E8DEC8] p-8 sm:p-10 rounded-3xl space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center font-bold font-heading text-lg">
              2
            </div>
            <h3 className="text-xl font-bold font-heading text-[#1A1C20]">
              Multi-Lens Scan
            </h3>
            <p className="text-sm text-[#665F52] leading-relaxed">
              Gemini audits the scene across 6 accessibility lenses to identify obstacles.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FAF7F0] border border-[#E8DEC8] p-8 sm:p-10 rounded-3xl space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-bold font-heading text-lg">
              3
            </div>
            <h3 className="text-xl font-bold font-heading text-[#1A1C20]">
              Get Pinpoints & Fixes
            </h3>
            <p className="text-sm text-[#665F52] leading-relaxed">
              View score breakdown, interactive pin markers, and actionable recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SIX ACCESSIBILITY LENSES GRID */}
      <section className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-8 sm:p-14 space-y-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FA8F79]">
              Perspectives
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1C20]">
              Universal Design Lenses
            </h2>
          </div>
          <p className="text-sm text-[#736C5E] max-w-md">
            Uncover barriers beyond your lived experience through multi-lens visual analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lensesList.map((lens, idx) => {
            const Icon = lens.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFFFF] border border-[#E6DBC9] p-6 sm:p-7 rounded-2xl space-y-3 shadow-xs hover:border-[#FA8F79] transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${lens.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold font-heading text-[#1A1C20]">
                  {lens.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#665F52] leading-relaxed">
                  {lens.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INSTANT DEMO SCENARIOS */}
      <section className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FA8F79]">
              Sample Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1C20]">
              Explore Samples
            </h2>
          </div>
          <span className="text-xs text-[#7A7365] bg-[#EFE8DC] px-4 py-1.5 rounded-full font-semibold">
            No upload required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SAMPLE_SCENARIOS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group bg-[#FAF7F0] hover:bg-[#FFFFFF] border border-[#E6DCC8] hover:border-[#FA8F79] rounded-3xl p-6 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1A1C20] border border-[#E0D5C1]">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-[#1A1C20]/80 text-[#FAF6EE] text-xs font-bold backdrop-blur-xs">
                    Score: {sample.result.accessibilityScore}/100
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#8C8475] uppercase tracking-wider">
                    {sample.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-[#1A1C20] group-hover:text-[#FA8F79] transition-colors mt-0.5">
                    {sample.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665F52] mt-1.5 line-clamp-2 leading-relaxed">
                    {sample.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EBE2D2] flex items-center justify-between text-xs font-bold text-[#FA8F79]">
                <span>View Analysis</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ETHICAL DISCLAIMER BANNER */}
      <section className="bg-[#FAF2E6] border border-[#E4D5BE] p-6 sm:p-8 rounded-3xl space-y-3 text-center max-w-3xl mx-auto shadow-xs">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#805D26] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Ethical AI Notice</span>
        </div>
        <p className="text-xs sm:text-sm text-[#5C4824] leading-relaxed">
          Drishti provides AI accessibility observations to expand awareness. It is not a legal substitute for formal ADA or WCAG compliance audits or lived-experience consultation.
        </p>
      </section>
    </div>
  );
};
