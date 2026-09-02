import React from 'react';
import {
  ScanEye,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { SampleScenario } from '../types';

// High-quality cinematic images for cards
import darkCameraImg from '../assets/images/dark_camera_cinematic_1788379424968.jpg';
import visionAuditImg from '../assets/images/vision_audit_cinematic_1788379450914.jpg';
import remediationBlueprintImg from '../assets/images/remediation_blueprint_1788379464706.jpg';
import wheelchairRampImg from '../assets/images/wheelchair_ramp_dark_1788379479331.jpg';
import zoomedEyeImg from '../assets/images/zoomed_eye_cinematic_1788379438441.jpg';
import acousticSoundImg from '../assets/images/acoustic_sound_dark_1788379493995.jpg';
import calmPathwayImg from '../assets/images/calm_mind_pathway_1788379509137.jpg';
import elderlySupportImg from '../assets/images/elderly_support_hand_1788379523988.jpg';
import strollerPassageImg from '../assets/images/stroller_passage_dark_1788379536597.jpg';

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
  const stepsList: Array<{
    stepNumber: string;
    title: string;
    desc: string;
    action: string;
    image: string;
  }> = [
    {
      stepNumber: '01',
      title: 'Capture Any Space',
      desc: 'Take a photo of physical environments, doorways, stairways, signage, or public transit paths.',
      action: 'Start capture',
      image: darkCameraImg,
    },
    {
      stepNumber: '02',
      title: 'Multimodal Vision Audit',
      desc: 'Gemini evaluates spatial cues, physical clearance, tactile elements, and sensory clarity.',
      action: 'Explore vision',
      image: visionAuditImg,
    },
    {
      stepNumber: '03',
      title: 'Actionable Remediation',
      desc: 'Receive categorized barrier pins, severity scoring, audio narration, and exportable PDF audit reports.',
      action: 'View reports',
      image: remediationBlueprintImg,
    },
  ];

  const lensesList: Array<{
    category: string;
    title: string;
    desc: string;
    action: string;
    image: string;
  }> = [
    {
      category: 'Physical Barriers',
      title: 'Mobility & Wheelchair',
      desc: 'Evaluates step thresholds, ramp slopes, turn radii, handrails, and passage width compliance.',
      action: 'Audit mobility',
      image: wheelchairRampImg,
    },
    {
      category: 'Sensory & Vision',
      title: 'Low Vision & Blindness',
      desc: 'Detects color contrast deficiencies, tactile ground surface indicators (TGSI), and lighting glare.',
      action: 'Audit contrast',
      image: zoomedEyeImg,
    },
    {
      category: 'Acoustic & Alerts',
      title: 'Deaf & Hard of Hearing',
      desc: 'Checks visual fire alarm indicators, acoustic reflection surfaces, and text assistive aids.',
      action: 'Audit alerts',
      image: acousticSoundImg,
    },
    {
      category: 'Wayfinding & Clarity',
      title: 'Cognitive & Neurodiverse',
      desc: 'Identifies sensory overload, confusing iconography, uncluttered navigation, and calm zones.',
      action: 'Audit wayfinding',
      image: calmPathwayImg,
    },
    {
      category: 'Aging & Stability',
      title: 'Elderly-Friendly',
      desc: 'Reviews slip resistance, non-glare rest seating, grab rail continuous grip, and step visibility.',
      action: 'Audit stability',
      image: elderlySupportImg,
    },
    {
      category: 'Reach & Clearance',
      title: 'Stroller & Passage',
      desc: 'Checks reachable height ranges, turnaround clearances, and door opening widths.',
      action: 'Audit reach',
      image: strollerPassageImg,
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
            Drishti reveals physical and sensory accessibility barriers in real-world spaces through multi-lens visual audits.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
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

      {/* 2. THREE-STEP PROCESS CARDS */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1C20]">
            How It Works
          </h2>
          <p className="text-sm text-[#736C5E]">
            A simple three-phase evaluation from photo capture to actionable remediation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {stepsList.map((step, idx) => (
            <div
              key={idx}
              onClick={onStartAnalysis}
              className="group relative overflow-hidden rounded-[28px] border border-white/15 hover:border-white/35 bg-[#090B0E] p-7 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[300px] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
            >
              {/* High Quality Cinematic Image */}
              <img
                src={step.image}
                alt={step.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Un-dimmed Subtle Gradient Overlay - keeps image bright and vivid while protecting text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-50% to-black/10 z-0" />

              {/* Top Step Index Pill */}
              <div className="z-10 relative flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider text-white/95 uppercase px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-sm">
                  Step {step.stepNumber}
                </span>
              </div>

              {/* Card Content */}
              <div className="z-10 relative my-4 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white group-hover:text-[#FA8F79] transition-colors drop-shadow-md">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#E2DCD2] leading-relaxed font-normal drop-shadow-sm max-w-[92%]">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="z-10 relative pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-[#FA8F79] transition-colors">
                  <span>{step.action}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-white/70 group-hover:text-[#FA8F79]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SIX ACCESSIBILITY LENSES BENTO GRID */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1C20]">
              Universal Design Lenses
            </h2>
            <p className="text-sm text-[#736C5E] max-w-md">
              Uncover barriers beyond your lived experience through multi-lens visual analysis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lensesList.map((lens, idx) => (
            <div
              key={idx}
              onClick={onStartAnalysis}
              className="group relative overflow-hidden rounded-[28px] border border-white/15 hover:border-white/35 bg-[#090B0E] p-7 sm:p-8 flex flex-col justify-between min-h-[270px] sm:min-h-[290px] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
            >
              {/* High Quality Cinematic Image */}
              <img
                src={lens.image}
                alt={lens.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Un-dimmed Subtle Gradient Overlay - keeps image bright and vivid while protecting text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-50% to-black/10 z-0" />

              {/* Category Label */}
              <div className="z-10 relative flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wide text-white/95 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-sm">
                  {lens.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="z-10 relative my-4 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white group-hover:text-[#FA8F79] transition-colors drop-shadow-md">
                  {lens.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#E2DCD2] leading-relaxed font-normal drop-shadow-sm max-w-[92%]">
                  {lens.desc}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="z-10 relative pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-[#FA8F79] transition-colors">
                  <span>{lens.action}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-white/70 group-hover:text-[#FA8F79]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INSTANT DEMO SCENARIOS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1C20]">
              Sample Spaces
            </h2>
            <p className="text-sm text-[#736C5E]">
              Explore pre-audited spaces without uploading an image.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {SAMPLE_SCENARIOS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group relative overflow-hidden rounded-[28px] bg-[#FFFFFF] border border-[#E5DAC8] p-6 sm:p-7 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-5 hover:border-[#D6C4AD]"
            >
              <div className="space-y-4 z-10 relative">
                {/* Clean Top Meta */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#6B6355]">
                    {sample.category}
                  </span>
                  <span className="text-xs font-bold text-[#1A1C20] bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#E5DAC8]">
                    Score: {sample.result.accessibilityScore}/100
                  </span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1A1C20] border border-[#000000]/10 shadow-xs">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-[#1A1C20] group-hover:text-[#FA8F79] transition-colors">
                    {sample.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544D40] mt-1 line-clamp-2 leading-relaxed">
                    {sample.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#000000]/10 flex items-center justify-between text-xs sm:text-sm font-bold text-[#1A1C20] group-hover:text-[#FA8F79] transition-colors z-10 relative">
                <span>View analysis</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ETHICAL DISCLAIMER BANNER */}
      <section className="bg-[#FAF2E6] border border-[#E4D5BE] p-6 sm:p-8 rounded-3xl space-y-3 text-center max-w-3xl mx-auto shadow-xs">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#805D26]">
          <ShieldCheck className="w-4 h-4" />
          <span>Notice</span>
        </div>
        <p className="text-xs sm:text-sm text-[#5C4824] leading-relaxed">
          Drishti provides AI accessibility observations to expand awareness. It is not a legal substitute for formal ADA or WCAG compliance audits or lived-experience consultation.
        </p>
      </section>
    </div>
  );
};
