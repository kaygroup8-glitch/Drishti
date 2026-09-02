import React, { useEffect } from 'react';
import { Bot, CheckCircle2, X, ShieldCheck, Layers, Cpu, FileCheck } from 'lucide-react';

interface AgentReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentReadyModal: React.FC<AgentReadyModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF6EE] border border-[#E3D8C7] rounded-[28px] max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-transform animate-scale-in"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE2D5] flex items-center justify-between bg-[#F4EDE0]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1C20] text-[#FAF6EE] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-[#FA8F79]" />
            </div>
            <div>
              <h2 id="agent-modal-title" className="text-lg sm:text-xl font-bold font-heading text-[#1A1C20]">
                Agent-Ready WebMCP
              </h2>
              <p className="text-xs text-[#6B6355]">
                W3C Web Model Context Protocol
              </p>
            </div>
          </div>

          <button
            id="agent-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B6355] hover:text-[#1A1C20] hover:bg-[#EAE1D2] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto overscroll-contain">
          {/* Status Indicator Chip */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-xs font-bold text-[#166534]">
                WebMCP Active & Registered
              </span>
            </div>
            <span className="text-xs font-mono text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full font-semibold">
              6 tools ready
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2.5 text-xs sm:text-sm text-[#524B3F] leading-relaxed">
            <p>
              Drishti is designed for seamless human and autonomous AI collaboration. Its accessibility inspection capabilities are registered directly into the browser&apos;s standard model context via <code className="px-1.5 py-0.5 rounded bg-[#EDE3D2] font-mono text-xs text-[#1A1C20]">navigator.modelContext</code>.
            </p>
            <p>
              When a WebMCP-compatible browser agent connects (such as ChatGPT&apos;s in-app browser or Chrome with <code className="px-1.5 py-0.5 rounded bg-[#EDE3D2] font-mono text-[11px] text-[#1A1C20]">--enable-features=WebModelContext</code>), it can autonomously request space evaluations, review detected barriers, highlight specific pins live on the human screen, prioritize architectural modifications, and export official reports.
            </p>
          </div>

          {/* Registered Capabilities 2x2 Grid */}
          <div className="space-y-2.5 pt-1">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6B6355]">
              Active Agent Tools (navigator.modelContext)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                  <Cpu className="w-3.5 h-3.5 text-[#FA8F79]" />
                  <span>analyze_space</span>
                </div>
                <p className="text-[11px] text-[#6B6355] leading-relaxed">
                  Evaluates physical photos across 6 universal design lenses.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                  <Layers className="w-3.5 h-3.5 text-[#FA8F79]" />
                  <span>get_barrier_details & focus_barrier</span>
                </div>
                <p className="text-[11px] text-[#6B6355] leading-relaxed">
                  Retrieves 2D pin locations and focuses pins on the human screen live.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FA8F79]" />
                  <span>get_recommendations & summary</span>
                </div>
                <p className="text-[11px] text-[#6B6355] leading-relaxed">
                  Calculates highest-impact remediation roadmaps and executive scorecards.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                  <FileCheck className="w-3.5 h-3.5 text-[#FA8F79]" />
                  <span>generate_accessibility_report</span>
                </div>
                <p className="text-[11px] text-[#6B6355] leading-relaxed">
                  Generates vector compliance summary documents for client download.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Security Note */}
          <div className="p-3.5 rounded-2xl bg-[#FAF2E6] border border-[#E4D5BE] flex items-start gap-2.5 text-xs text-[#5C4824]">
            <ShieldCheck className="w-4 h-4 text-[#805D26] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              External agents operate within strictly scoped accessibility methods. API credentials remain securely protected on the server.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#EAE2D5] bg-[#F4EDE0]/70 flex justify-end shrink-0">
          <button
            id="agent-modal-got-it-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#1A1C20] hover:bg-[#2C2E35] text-[#FAF6EE] font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
