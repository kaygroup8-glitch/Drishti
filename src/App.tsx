import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HeroLanding } from './components/HeroLanding';
import { UploadCard } from './components/UploadCard';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AgentWorkspace } from './components/AgentWorkspace';
import { HistoryView } from './components/HistoryView';
import { CameraModal } from './components/CameraModal';
import { AboutLegalModal } from './components/AboutLegalModal';
import { AgentReadyModal } from './components/AgentReadyModal';
import { AnalysisResult, SampleScenario } from './types';
import { initializeWebMCP } from './webmcp';
import { exportAnalysisToPDF } from './utils/pdfExport';

const STORAGE_KEY = 'drishti_analysis_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'analyze' | 'agent' | 'history' | 'about'>('home');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selectedFindingId, setSelectedFindingId] = useState<number | null>(null);
  const [activeLensFilter, setActiveLensFilter] = useState<string>('All');

  // Ref to always provide the latest active scan result to WebMCP async tools
  const currentResultRef = useRef<AnalysisResult | null>(currentResult);
  const selectedFindingIdRef = useRef<number | null>(selectedFindingId);
  const activeLensFilterRef = useRef<string>(activeLensFilter);

  useEffect(() => {
    currentResultRef.current = currentResult;
  }, [currentResult]);

  useEffect(() => {
    selectedFindingIdRef.current = selectedFindingId;
  }, [selectedFindingId]);

  useEffect(() => {
    activeLensFilterRef.current = activeLensFilter;
  }, [activeLensFilter]);

  const updateCurrentResult = (result: AnalysisResult | null) => {
    currentResultRef.current = result;
    setCurrentResult(result);
    if (result && result.findings && result.findings.length > 0) {
      setSelectedFindingId(result.findings[0].id);
    } else {
      setSelectedFindingId(null);
    }
  };

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToStorage = (updatedHistory: AnalysisResult[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  };

  const handleAnalyze = async (imageData: {
    base64: string;
    mimeType: string;
    fileName: string;
    lenses: string[];
  }): Promise<AnalysisResult> => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingPreview(imageData.base64);
    setActiveTab('analyze');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageData.base64,
          mimeType: imageData.mimeType,
          fileName: imageData.fileName,
          selectedLenses: imageData.lenses,
        }),
      });

      if (!res.ok) {
        let errMsg = "Drishti couldn't complete the analysis. Please check your Gemini API key and try again.";
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            if (errorData.error) errMsg = errorData.error;
          } else {
            const textData = await res.text();
            if (textData.includes('413') || textData.toLowerCase().includes('payload too large')) {
              errMsg = 'The image file size is too large. Please upload an image under 8MB.';
            } else if (textData.includes('404')) {
              errMsg = 'API route not found. Please try again.';
            }
          }
        } catch {
          // ignore parse error
        }
        throw new Error(errMsg);
      }

      const result: AnalysisResult = await res.json();
      updateCurrentResult(result);

      // Automatically add to history
      setHistory((prev) => {
        const updated = [result, ...prev.filter((h) => h.id !== result.id)];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save history to localStorage', e);
        }
        return updated;
      });

      return result;
    } catch (error: any) {
      console.error('Analysis error:', error);
      const msg = error.message || "Drishti couldn't complete the analysis. Please try again.";
      setErrorMessage(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register WebMCP Tools with navigator.modelContext, window.modelContext, and document.modelContext
  useEffect(() => {
    const unregister = initializeWebMCP({
      getCurrentResult: () => currentResultRef.current,
      setCurrentResult: (result) => {
        updateCurrentResult(result);
      },
      triggerAnalysis: async (imageData) => {
        return await handleAnalyze(imageData);
      },
      triggerExportPDF: async (result) => {
        await exportAnalysisToPDF(result);
      },
      saveToHistory: (result) => {
        handleSaveResult(result);
      },
      setSelectedBarrierId: (id) => {
        setSelectedFindingId(id);
      },
      getSelectedBarrierId: () => selectedFindingIdRef.current,
      setActiveLensFilter: (lens) => {
        setActiveLensFilter(lens);
      },
      getActiveLensFilter: () => activeLensFilterRef.current,
    });

    return () => {
      unregister();
    };
  }, []);

  // Synchronize remote MCP agent actions (e.g. OpenAI Agent focus_barrier) with the human browser canvas
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/active-state');
        if (!res.ok) return;
        const state = await res.json();
        if (
          isMounted &&
          state.selectedBarrierId !== null &&
          state.selectedBarrierId !== undefined &&
          state.selectedBarrierId !== selectedFindingIdRef.current
        ) {
          setSelectedFindingId(state.selectedBarrierId);
        }
      } catch {
        // quiet fallback
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSelectSample = (scenario: SampleScenario) => {
    updateCurrentResult(scenario.result);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync selected scenario with remote MCP server
    fetch('/api/sync-active-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: scenario.result.id,
        imageName: scenario.result.imageName,
        imageUrl: scenario.result.imageUrl,
        accessibilityScore: scenario.result.accessibilityScore,
        scoreLabel: scenario.result.scoreLabel,
        strongAreas: scenario.result.strongAreas,
        areasNeedingAttention: scenario.result.areasNeedingAttention,
        highestPriorityImprovement: scenario.result.highestPriorityImprovement,
        summary: scenario.result.summary,
        findings: scenario.result.findings,
        selectedBarrierId: scenario.result.findings[0]?.id || null,
      }),
    }).catch(() => {});
  };

  const handleSaveResult = (resultToSave: AnalysisResult) => {
    const exists = history.some((h) => h.id === resultToSave.id);
    if (!exists) {
      const updated = [resultToSave, ...history];
      saveToStorage(updated);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all saved scans?')) {
      saveToStorage([]);
    }
  };

  const handleCameraCapture = (base64Data: string) => {
    handleAnalyze({
      base64: base64Data,
      mimeType: 'image/jpeg',
      fileName: `camera_capture_${new Date().toISOString().slice(0, 10)}.jpg`,
      lenses: ['all'],
    });
  };

  const isCurrentResultSaved = currentResult
    ? history.some((h) => h.id === currentResult.id)
    : false;

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1C20] flex flex-col font-sans selection:bg-[#FA8F79]/30">
      {/* Website Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'analyze' && !currentResult) {
            setErrorMessage(null);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={history.length}
        onOpenAgentModal={() => setIsAgentModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="grow pt-6 sm:pt-10">
        {/* TAB 1: HOME / LANDING */}
        {activeTab === 'home' && (
          <HeroLanding
            onStartAnalysis={() => {
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectSample={(scenario) => {
              handleSelectSample(scenario);
              setActiveTab('analyze');
            }}
            onOpenAbout={() => {
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 2: ANALYZE / RESULT DASHBOARD (STUDIO) */}
        {activeTab === 'analyze' && (
          <>
            {isLoading ? (
              <AnalysisLoader imagePreview={loadingPreview} />
            ) : currentResult ? (
              <ResultsDashboard
                result={currentResult}
                selectedFindingId={selectedFindingId}
                onSelectFindingId={setSelectedFindingId}
                activeLensFilter={activeLensFilter}
                onSelectLensFilter={setActiveLensFilter}
                onReset={() => {
                  updateCurrentResult(null);
                  setErrorMessage(null);
                }}
                onSave={handleSaveResult}
                isSaved={isCurrentResultSaved}
                onOpenAgent={() => {
                  setActiveTab('agent');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : (
              <UploadCard
                onAnalyze={handleAnalyze}
                onOpenLiveCamera={() => setIsCameraOpen(true)}
                onSelectSample={(scenario) => {
                  handleSelectSample(scenario);
                }}
                isLoading={isLoading}
                errorMessage={errorMessage}
              />
            )}
          </>
        )}

        {/* TAB 3: AGENT WORKSPACE */}
        {activeTab === 'agent' && (
          <AgentWorkspace
            currentResult={currentResult}
            onOpenStudio={() => {
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectSample={handleSelectSample}
            onOpenUpload={() => {
              updateCurrentResult(null);
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAgentInfo={() => setIsAgentModalOpen(true)}
            onClearSpace={() => updateCurrentResult(null)}
          />
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectResult={(selected) => {
              updateCurrentResult(selected);
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onClearHistory={handleClearHistory}
            onStartNew={() => {
              updateCurrentResult(null);
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 5: ABOUT & LEGAL */}
        {activeTab === 'about' && (
          <AboutLegalModal
            onStartAnalysis={() => {
              updateCurrentResult(null);
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Website Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAgentModal={() => setIsAgentModalOpen(true)}
      />

      {/* Camera Live Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* WebMCP Agent Protocol Info Modal */}
      <AgentReadyModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Mobile Floating Bottom Dock */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={history.length}
      />
    </div>
  );
}
