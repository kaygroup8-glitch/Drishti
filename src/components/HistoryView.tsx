import React, { useState } from 'react';
import { History, Trash2, ArrowRight, ScanEye, Clock, FileDown, Loader2 } from 'lucide-react';
import { AnalysisResult } from '../types';
import { exportAnalysisToPDF } from '../utils/pdfExport';

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
  onStartNew: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onStartNew,
}) => {
  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleExportSingle = async (e: React.MouseEvent, item: AnalysisResult) => {
    e.stopPropagation();
    try {
      setExportingId(item.id);
      await exportAnalysisToPDF(item);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('Could not export PDF report.');
    } finally {
      setExportingId(null);
    }
  };
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-12 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-wider text-[#FA8F79] uppercase">
            Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1A1C20] tracking-tight">
            Saved Scans
          </h1>
          <p className="text-xs sm:text-sm text-[#736C5E]">
            Stored locally on your device for rapid reference.
          </p>
        </div>

        {history.length > 0 && (
          <button
            id="clear-history-btn"
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FCD2D2] text-[#991B1B] text-xs font-bold transition-colors self-start sm:self-center cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items Grid or Empty State */}
      {history.length === 0 ? (
        <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-12 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#F0E8DC] text-[#8C8474] mx-auto flex items-center justify-center">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold font-heading text-[#1A1C20]">
              No saved scans yet
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] max-w-sm mx-auto">
              Upload a photo or choose a sample scenario to generate and save your first accessibility review.
            </p>
          </div>
          <button
            id="history-start-analysis-btn"
            onClick={onStartNew}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FA8F79] hover:bg-[#F9775E] text-[#1A1C20] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ScanEye className="w-4 h-4" />
            <span>Scan Space Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {history.map((item) => {
            const highCount = item.findings.filter((f) => f.severity === 'High').length;
            const formattedDate =
              item.createdAt === 'Demo analysis'
                ? 'Demo scenario'
                : new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

            return (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="group bg-[#FAF7F0] hover:bg-[#FFFFFF] border border-[#E6DCC8] hover:border-[#FA8F79] rounded-3xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#1A1C20] shrink-0 border border-[#E0D5C1]">
                    <img
                      src={item.imageUrl}
                      alt={item.imageName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex flex-col justify-between grow min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] text-[#8C8475] flex items-center gap-1 truncate">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{formattedDate}</span>
                        </span>
                        {item.isDemo && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0DE] text-[#805D26]">
                            Demo
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold font-heading text-[#1A1C20] group-hover:text-[#FA8F79] transition-colors truncate mt-0.5">
                        {item.imageName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <div className="px-2.5 py-1 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-bold font-heading">
                        {item.accessibilityScore}/100
                      </div>
                      <div className="text-[11px] text-[#70695B] font-medium truncate">
                        {item.findings.length} barriers
                        {highCount > 0 && ` (${highCount} high)`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#EBE2D2] flex items-center justify-between text-xs font-bold">
                  <button
                    type="button"
                    onClick={(e) => handleExportSingle(e, item)}
                    disabled={exportingId === item.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE8DC] hover:bg-[#E4DCCE] text-[#423C32] transition-colors cursor-pointer disabled:opacity-60"
                    title="Export PDF Report"
                  >
                    {exportingId === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-[#FA8F79] animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5 text-[#FA8F79]" />
                        <span>PDF Report</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 text-[#FA8F79]">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
