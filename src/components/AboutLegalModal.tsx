import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Lock,
  Eye,
  ScanEye,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AboutLegalModalProps {
  onStartAnalysis: () => void;
}

export const AboutLegalModal: React.FC<AboutLegalModalProps> = ({ onStartAnalysis }) => {
  const [activeSection, setActiveSection] = useState<'about' | 'terms' | 'privacy'>('about');

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-12 pb-24 space-y-8">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-[#E8DEC8] pb-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#FA8F79] uppercase">
            Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1A1C20] tracking-tight">
            About & Legal
          </h1>
        </div>

        {/* Section Selector Pills */}
        <div className="flex items-center gap-1.5 bg-[#EFE7DC] p-1 rounded-2xl">
          <button
            id="tab-about-btn"
            onClick={() => setActiveSection('about')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'about'
                ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                : 'text-[#5C5548] hover:text-[#1A1C20]'
            }`}
          >
            About
          </button>
          <button
            id="tab-terms-btn"
            onClick={() => setActiveSection('terms')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'terms'
                ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                : 'text-[#5C5548] hover:text-[#1A1C20]'
            }`}
          >
            Terms
          </button>
          <button
            id="tab-privacy-btn"
            onClick={() => setActiveSection('privacy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'privacy'
                ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                : 'text-[#5C5548] hover:text-[#1A1C20]'
            }`}
          >
            Privacy
          </button>
        </div>
      </div>

      {/* SECTION 1: ABOUT DRISHTI */}
      {activeSection === 'about' && (
        <div className="space-y-6">
          {/* Origin & Concept Card */}
          <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-7 sm:p-9 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1C20] text-[#FAF6EE] flex items-center justify-center font-bold text-lg">
                दृष्टि
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading text-[#1A1C20]">
                  The Meaning of Drishti
                </h2>
                <p className="text-xs text-[#7A7264]">
                  Sanskrit origin: Vision, Perspective, Gaze
                </p>
              </div>
            </div>

            <p className="text-sm text-[#4A4438] leading-relaxed">
              Most designers and space owners view the built environment through a single default lens: their own. Drishti helps reveal critical physical and sensory barriers that might otherwise be overlooked.
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF0E1] border border-[#E6D4BA] space-y-1">
              <span className="text-xs font-bold text-[#8C6120] uppercase tracking-wider">
                Core Motto
              </span>
              <p className="text-lg font-bold font-heading text-[#1A1C20]">
                "See beyond your perspective."
              </p>
            </div>
          </div>

          {/* Hackathon Affiliation */}
          <div className="bg-[#F0F7FA] border border-[#CCE2ED] rounded-3xl p-6 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E5675]">
                <ScanEye className="w-4 h-4 text-[#0284C7]" />
                <span>Google AI Workshop Hackathon</span>
              </div>
              <a
                href="https://google-ai-workshop-hackathon.devpost.com/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#0284C7] hover:underline inline-flex items-center gap-1"
              >
                <span>Devpost</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs text-[#335669] leading-relaxed">
              Built with Gemini multimodal vision models via server-side Google GenAI SDK to empower universal design and accessibility awareness.
            </p>
          </div>

          {/* Ethical AI Framing Card */}
          <div className="bg-[#FAF4EB] border border-[#ECDCC7] rounded-3xl p-7 sm:p-9 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9A621E] uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Ethical AI Principles</span>
            </div>

            <h3 className="text-lg font-bold font-heading text-[#1A1C20]">
              Responsible Accessibility Assistance
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-[#4D4537]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1C20]">No Lived-Experience Substitution:</strong> AI cannot replicate the lived reality of disabled individuals. Drishti serves as an observational lens, not a final authority.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1C20]">Objective Framing:</strong> Observations are labeled as potential barriers for human verification.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1C20]">No Personal Profiling:</strong> Drishti does not identify individuals or diagnose medical conditions.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A1C20]">Evidence Calibration:</strong> If visual information is insufficient or occluded, the AI explicitly notes uncertainty.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 2: TERMS OF SERVICE */}
      {activeSection === 'terms' && (
        <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-7 sm:p-9 space-y-5 text-[#3D372D] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C6120] uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </div>

          <h2 className="text-xl font-bold font-heading text-[#1A1C20]">
            User Agreement
          </h2>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed border-t border-[#E8DEC8] pt-4">
            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">1. Educational & Awareness Use</h3>
              <p>
                Drishti is an exploratory AI tool to highlight prospective physical and environmental accessibility considerations. It does not provide formal architectural certification, ADA/WCAG compliance verification, or safety guarantees.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">2. Image Upload Guidelines</h3>
              <p>
                Users agree not to upload photographs containing confidential private data, non-consensual personal imagery, or unlawful material.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">3. Disclaimer of Warranties</h3>
              <p>
                The software and AI predictions are provided "as is". You must not rely on Drishti as a substitute for certified accessibility audits.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">4. Limitation of Liability</h3>
              <p>
                In no event shall the authors be liable for any claims, damages, or compliance penalties arising from decisions based on Drishti observations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PRIVACY POLICY */}
      {activeSection === 'privacy' && (
        <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-7 sm:p-9 space-y-5 text-[#3D372D] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C6120] uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Data & Privacy</span>
          </div>

          <h2 className="text-xl font-bold font-heading text-[#1A1C20]">
            Privacy Policy
          </h2>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed border-t border-[#E8DEC8] pt-4">
            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">1. Ephemeral Processing</h3>
              <p>
                Photos uploaded by users are processed ephemerally on the application server and passed to Gemini vision endpoints for analysis. We do not store raw photos in permanent server databases.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">2. Local Storage</h3>
              <p>
                Saved analysis history is stored strictly on your local browser device via HTML5 LocalStorage. No account registration is required.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">3. Data Deletion</h3>
              <p>
                You can delete your local analysis history at any time with a single click in the Saved tab.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#1A1C20] mb-1">4. Camera Stream</h3>
              <p>
                The live camera feed stays local inside your browser. Only the captured snapshot is sent for analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex justify-center">
        <button
          id="about-cta-start-btn"
          onClick={onStartAnalysis}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FA8F79] hover:bg-[#F9775E] text-[#1A1C20] font-bold text-sm shadow-xs transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Open Studio</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
