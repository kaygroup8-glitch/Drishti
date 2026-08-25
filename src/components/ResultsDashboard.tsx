import React, { useState, useRef, useEffect } from 'react';
import {
  ScanSearch,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Lightbulb,
  Share2,
  Info,
  FileDown,
  Loader2,
  Volume2,
  VolumeX,
  Pause,
  Play
} from 'lucide-react';
import { AnalysisResult, Finding } from '../types';
import { getLensColor, getSeverityStyle } from '../utils/lensConfig';
import { exportAnalysisToPDF } from '../utils/pdfExport';
import { narrator } from '../utils/speechNarrator';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onSave: (result: AnalysisResult) => void;
  isSaved: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onReset,
  onSave,
  isSaved,
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<number | null>(
    result.findings.length > 0 ? result.findings[0].id : null
  );
  const [activeLensFilter, setActiveLensFilter] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedCardIds, setExpandedCardIds] = useState<Set<number>>(
    () => new Set(result.findings.map((f) => f.id))
  );
  const [isExporting, setIsExporting] = useState(false);
  const [speechStatus, setSpeechStatus] = useState(narrator.getStatus());

  const findingRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const toggleCardExpansion = (id: number) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedCardIds(new Set(result.findings.map((f) => f.id)));
  };

  const handleCollapseAll = () => {
    setExpandedCardIds(new Set());
  };

  useEffect(() => {
    const unsubscribe = narrator.subscribe(() => {
      setSpeechStatus(narrator.getStatus());
    });
    return () => {
      narrator.stop();
      unsubscribe();
    };
  }, []);

  const handleToggleFullSpeech = () => {
    if (speechStatus.isSpeaking && !speechStatus.isPaused) {
      narrator.pause();
    } else if (speechStatus.isPaused) {
      narrator.resume();
    } else {
      narrator.speakFullAudit(result);
    }
  };

  const handleStopSpeech = () => {
    narrator.stop();
  };

  const handleSpeakFinding = (finding: Finding) => {
    if (speechStatus.isSpeaking && speechStatus.currentFindingId === finding.id) {
      narrator.stop();
    } else {
      narrator.speakFinding(finding);
    }
  };

  const availableLenses = [
    'All',
    ...Array.from(new Set(result.findings.map((f) => f.lens))),
  ];

  const filteredFindings =
    activeLensFilter === 'All'
      ? result.findings
      : result.findings.filter((f) => f.lens === activeLensFilter);

  const handleMarkerClick = (id: number) => {
    setSelectedFindingId(id);
    setExpandedCardIds((prev) => new Set(prev).add(id));
    const el = findingRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await exportAnalysisToPDF(result);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('Could not generate PDF report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Drishti Accessibility Analysis',
        text: `Accessibility Score: ${result.accessibilityScore}/100 with ${result.findings.length} observations.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Drishti: ${result.imageName} - Score: ${result.accessibilityScore}/100 (${result.findings.length} observations)`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const highSeverityCount = result.findings.filter((f) => f.severity === 'High').length;
  const mediumSeverityCount = result.findings.filter((f) => f.severity === 'Medium').length;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-24 space-y-10">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-[#E8DDC9] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            {result.isDemo ? (
              <span className="px-3.5 py-1 rounded-full bg-[#FAF0DE] border border-[#E8DAC2] text-xs font-bold text-[#805D26]">
                Demo Scenario
              </span>
            ) : (
              <span className="px-3.5 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-bold text-[#2E7D32]">
                Live Scan
              </span>
            )}
            <span className="text-xs text-[#787163] font-semibold">
              {new Date(result.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1A1C20] tracking-tight truncate max-w-xl">
            {result.imageName}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Audio Narration Toggle */}
          <div className="flex items-center rounded-2xl bg-[#EFE8DC] p-1 border border-[#E0D5C3]">
            <button
              id="listen-audit-btn"
              onClick={handleToggleFullSpeech}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                speechStatus.isSpeaking && !speechStatus.isPaused
                  ? 'bg-[#FA8F79] text-[#1A1C20] shadow-xs'
                  : 'hover:bg-[#E4DCCE] text-[#423C32]'
              }`}
              title={speechStatus.isSpeaking ? (speechStatus.isPaused ? 'Resume Audio' : 'Pause Audio') : 'Listen to Full Audit Report'}
            >
              {speechStatus.isSpeaking && !speechStatus.isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Voice</span>
                  {/* Subtle pulsing soundwave */}
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-[#1A1C20] rounded-full animate-bounce"></span>
                    <span className="w-1 h-4 bg-[#1A1C20] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-1 h-2 bg-[#1A1C20] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </span>
                </>
              ) : speechStatus.isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#FA8F79]" />
                  <span>Listen to Audit</span>
                </>
              )}
            </button>

            {speechStatus.isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-1.5 rounded-xl hover:bg-[#E4DCCE] text-[#787163] hover:text-[#1A1C20] transition-colors cursor-pointer ml-0.5"
                title="Stop Audio"
                aria-label="Stop Audio"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="export-pdf-btn"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EFE8DC] hover:bg-[#E4DCCE] text-[#423C32] text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            title="Download PDF Audit Report"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#FA8F79] animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-[#FA8F79]" />
                <span>Export PDF</span>
              </>
            )}
          </button>

          <button
            id="share-analysis-btn"
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EFE8DC] hover:bg-[#E4DCCE] text-[#423C32] text-xs font-bold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#756E61]" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            id="save-analysis-btn"
            onClick={() => onSave(result)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#1A1C20] text-[#FAF6EE]'
                : 'bg-[#FA8F79] hover:bg-[#F9775E] text-[#1A1C20] shadow-xs'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            id="new-analysis-btn"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1A1C20] hover:bg-[#2F323A] text-[#FAF6EE] text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* KPI & Summary Bento Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Score Capsule Card (Left: 5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#E9DEC7] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-widest text-[#FA8F79] uppercase">
                Accessibility Score
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EFE8DC] text-[#635C4E]">
                {result.scoreLabel}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-extrabold font-heading text-[#1A1C20] tracking-tight">
                {result.accessibilityScore}
              </span>
              <span className="text-2xl font-bold text-[#8C8475]">/ 100</span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A7364] leading-relaxed">
              Evaluated across step thresholds, clearances, contrast, and visual signage.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E8DEC8]">
            <div className="text-center p-3 rounded-2xl bg-[#FFFFFF]">
              <span className="block text-2xl font-bold font-heading text-[#1A1C20]">
                {result.findings.length}
              </span>
              <span className="text-[11px] font-semibold text-[#807769]">
                Observations
              </span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-[#FEE2E2]">
              <span className="block text-2xl font-bold font-heading text-[#991B1B]">
                {highSeverityCount}
              </span>
              <span className="text-[11px] font-semibold text-[#991B1B]">
                High
              </span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-[#FEF3C7]">
              <span className="block text-2xl font-bold font-heading text-[#92400E]">
                {mediumSeverityCount}
              </span>
              <span className="text-[11px] font-semibold text-[#92400E]">
                Medium
              </span>
            </div>
          </div>
        </div>

        {/* Priority Strengths & Areas Needing Attention (Right: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Highest Priority Recommendation Card */}
          <div className="bg-[#FAF4EB] border border-[#EADBCA] p-5 sm:p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D97706] uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Top Priority</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-[#1A1C20] leading-snug">
              {result.highestPriorityImprovement}
            </p>
          </div>

          {/* Strengths & Attention Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 grow">
            {/* Strong Areas */}
            <div className="bg-[#F0FAF4] border border-[#D1EBD9] p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#065F46] uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Strengths</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#2A4D3B]">
                {result.strongAreas.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#10B981] font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas Needing Attention */}
            <div className="bg-[#FEF6F5] border border-[#FCDAD6] p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#991B1B] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-[#FA8F79]" />
                <span>Areas to Fix</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#6B2A2A]">
                {result.areasNeedingAttention.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#FA8F79] font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Perspective Summary Note */}
      <div className="bg-[#F6EFE3] border border-[#E2D6C0] p-5 sm:p-6 rounded-3xl text-sm text-[#453F34] leading-relaxed flex items-start gap-3.5 shadow-xs">
        <Info className="w-5 h-5 text-[#8A7F6C] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#1A1C20] block mb-1">Perspective Summary:</span>
          <p>{result.summary}</p>
        </div>
      </div>

      {/* Interactive Visual Map with Pin Markers */}
      <div className="bg-[#FAF7F0] border border-[#E9DEC7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#FA8F79] uppercase">
              Coordinates
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#1A1C20]">
              Barrier Map
            </h2>
          </div>
          <span className="text-xs text-[#716A5E] bg-[#EFE8DC] px-3.5 py-1.5 rounded-full font-semibold">
            Select a pin to inspect
          </span>
        </div>

        {/* Large Rounded Image Container */}
        <div className="relative rounded-3xl overflow-hidden bg-[#1A1C20] border-2 border-[#DFD3BE] shadow-md max-h-[560px] flex items-center justify-center">
          <img
            src={result.imageUrl}
            alt={`Accessibility analysis for ${result.imageName}`}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[560px] object-contain"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none"></div>

          {/* Markers */}
          {result.findings.map((finding) => {
            const isSelected = selectedFindingId === finding.id;
            const x = Math.min(92, Math.max(8, finding.location.xPercent));
            const y = Math.min(90, Math.max(10, finding.location.yPercent));

            return (
              <div
                key={finding.id}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20 group"
              >
                <button
                  type="button"
                  id={`marker-pin-${finding.id}`}
                  onClick={() => handleMarkerClick(finding.id)}
                  aria-label={`View finding ${finding.id}: ${finding.title}`}
                  className={`relative flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'w-11 h-11 rounded-full bg-[#FA8F79] text-[#1A1C20] ring-4 ring-white shadow-2xl scale-125 z-30'
                      : 'w-8 h-8 rounded-full bg-[#1A1C20]/90 hover:bg-[#FA8F79] text-[#FAF6EE] hover:text-[#1A1C20] ring-2 ring-white/90 shadow-md group-hover:scale-110'
                  }`}
                >
                  <span className="text-xs font-extrabold font-heading">
                    {finding.id}
                  </span>

                  {isSelected && (
                    <span className="absolute -inset-1.5 rounded-full bg-[#FA8F79]/50 animate-ping pointer-events-none"></span>
                  )}
                </button>

                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 px-3 py-1.5 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-semibold whitespace-nowrap shadow-xl transition-all pointer-events-none ${
                    isSelected
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-1 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
                  }`}
                >
                  [{finding.id}] {finding.title}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1C20]"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Pin Legend Strip */}
        <div className="flex flex-wrap gap-2 pt-2">
          {result.findings.map((finding) => (
            <button
              key={finding.id}
              onClick={() => handleMarkerClick(finding.id)}
              className={`text-xs px-3.5 py-2 rounded-2xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                selectedFindingId === finding.id
                  ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-sm ring-2 ring-[#FA8F79]'
                  : 'bg-[#EFE8DC] text-[#4F493D] hover:bg-[#E4DCCE]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#FA8F79] text-[#1A1C20] text-xs font-bold flex items-center justify-center">
                {finding.id}
              </span>
              <span>{finding.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Findings & Actionable Solutions Stream */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#FA8F79] uppercase">
              Action Plan
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#1A1C20]">
              Findings & Fixes
            </h2>
          </div>
          <span className="text-xs text-[#7A7365]">
            Showing {filteredFindings.length} of {result.findings.length}
          </span>
        </div>

        {/* Filter & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {availableLenses.map((lens) => (
              <button
                key={lens}
                onClick={() => setActiveLensFilter(lens)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeLensFilter === lens
                    ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-sm'
                    : 'bg-[#EFE8DC] text-[#544E41] hover:bg-[#E5DCCE]'
                }`}
              >
                {lens}
              </button>
            ))}
          </div>

          {/* Quick Expand / Collapse Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExpandAll}
              className="text-xs font-bold text-[#6E6759] hover:text-[#1A1C20] px-3 py-1.5 rounded-xl hover:bg-[#EFE8DC] transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-[#C5BBAA]">•</span>
            <button
              onClick={handleCollapseAll}
              className="text-xs font-bold text-[#6E6759] hover:text-[#1A1C20] px-3 py-1.5 rounded-xl hover:bg-[#EFE8DC] transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Finding Cards */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => {
            const isSelected = selectedFindingId === finding.id;
            const isExpanded = expandedCardIds.has(finding.id);
            const severity = getSeverityStyle(finding.severity);
            const lensColor = getLensColor(finding.lens);

            return (
              <div
                key={finding.id}
                ref={(el) => (findingRefs.current[finding.id] = el)}
                className={`bg-[#FAF7F0] border rounded-3xl p-5 sm:p-6 transition-all shadow-xs space-y-4 ${
                  isSelected
                    ? 'border-[#FA8F79] ring-2 ring-[#FA8F79]/30 bg-[#FFFDF9]'
                    : 'border-[#E7DDC8] hover:border-[#D8CCA]'
                }`}
              >
                {/* Finding Header (Clickable anywhere to expand/collapse) */}
                <div
                  onClick={() => toggleCardExpansion(finding.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#1A1C20] text-[#FAF6EE] flex items-center justify-center font-bold text-base shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {finding.id}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-[#1A1C20] group-hover:text-[#FA8F79] transition-colors">
                        {finding.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1">
                        <span
                          className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${lensColor.bg} ${lensColor.text} ${lensColor.border}`}
                        >
                          {finding.lens}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${severity.bg} ${severity.text}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${severity.dot}`}></span>
                          <span>{severity.label}</span>
                        </span>
                        <span className="text-xs text-[#857D6F]">
                          Confidence: {finding.confidence}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      id={`speak-finding-${finding.id}`}
                      onClick={() => handleSpeakFinding(finding)}
                      className={`p-2 rounded-2xl transition-all cursor-pointer ${
                        speechStatus.isSpeaking && speechStatus.currentFindingId === finding.id
                          ? 'bg-[#FA8F79] text-[#1A1C20] ring-2 ring-[#1A1C20]/20 shadow-xs'
                          : 'hover:bg-[#EFE7DC] text-[#6E6759] hover:text-[#1A1C20]'
                      }`}
                      title={
                        speechStatus.isSpeaking && speechStatus.currentFindingId === finding.id
                          ? 'Stop reading this finding'
                          : 'Read this finding aloud'
                      }
                      aria-label={`Read finding ${finding.id} aloud`}
                    >
                      {speechStatus.isSpeaking && speechStatus.currentFindingId === finding.id ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCardExpansion(finding.id)}
                      className="p-2 rounded-2xl hover:bg-[#EFE7DC] text-[#6E6759] hover:text-[#1A1C20] transition-colors cursor-pointer"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Card Details */}
                {isExpanded && (
                  <div className="space-y-4 pt-2 border-t border-[#EAE1D1]">
                    {/* Perspective Insight Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* What Drishti Sees */}
                      <div className="bg-[#FAF2EB] border border-[#ECDBC9] p-5 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#A7412E] uppercase tracking-wider">
                          <Eye className="w-4 h-4" />
                          <span>Observation</span>
                        </div>
                        <p className="text-sm text-[#473B32] leading-relaxed">
                          {finding.whatDetected}
                        </p>
                        {finding.whyItMatters && (
                          <div className="pt-2 text-xs text-[#7A6455] italic border-t border-[#ECDBC9]/60">
                            <span className="font-semibold not-italic">Impact: </span>
                            {finding.whyItMatters}
                          </div>
                        )}
                      </div>

                      {/* How to Improve It */}
                      <div className="bg-[#F0FAF4] border border-[#CFEBD7] p-5 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#065F46] uppercase tracking-wider">
                          <Lightbulb className="w-4 h-4 text-[#10B981]" />
                          <span>Improvement</span>
                        </div>
                        <p className="text-sm text-[#274B37] font-semibold leading-relaxed">
                          {finding.suggestedImprovement}
                        </p>
                        {finding.evidenceAssessment && (
                          <div className="pt-2 text-xs text-[#4E755D] border-t border-[#CFEBD7]/60">
                            <span className="font-semibold">Evidence: </span>
                            {finding.evidenceAssessment}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Marker Link */}
                    <div className="flex items-center justify-between text-xs text-[#7A7365] pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#FA8F79]" />
                        <span>Location: {finding.location.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFindingId(finding.id);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="text-[#FA8F79] hover:underline font-bold cursor-pointer"
                      >
                        View pin ↑
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ethical Disclaimer Card */}
      <div className="bg-[#FAF2E6] border border-[#E2D2B8] p-6 rounded-3xl space-y-2 text-center max-w-3xl mx-auto shadow-xs">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#6E5528] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#8C6F34]" />
          <span>Ethical AI Notice</span>
        </div>
        <p className="text-xs sm:text-sm text-[#5C4A28] leading-relaxed">
          {result.disclaimer}
        </p>
      </div>
    </div>
  );
};
