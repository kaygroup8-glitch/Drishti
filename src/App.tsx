import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HeroLanding } from './components/HeroLanding';
import { UploadCard } from './components/UploadCard';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HistoryView } from './components/HistoryView';
import { CameraModal } from './components/CameraModal';
import { AboutLegalModal } from './components/AboutLegalModal';
import { AnalysisResult, SampleScenario } from './types';

const STORAGE_KEY = 'drishti_analysis_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'analyze' | 'history' | 'about'>('home');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

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
  }) => {
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
        let errMsg = "Drishti couldn't complete the analysis. Please check your Gemini API key in Vercel settings and try again.";
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
              errMsg = 'API route not found. Please sync the latest commit to Vercel.';
            }
          }
        } catch {
          // ignore parse error
        }
        throw new Error(errMsg);
      }

      const result: AnalysisResult = await res.json();
      setCurrentResult(result);

      // Automatically add to history
      const updated = [result, ...history.filter((h) => h.id !== result.id)];
      saveToStorage(updated);
    } catch (error: any) {
      console.error('Analysis error:', error);
      setErrorMessage(error.message || "Drishti couldn't complete the analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (scenario: SampleScenario) => {
    setCurrentResult(scenario.result);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onSelectSample={handleSelectSample}
            onOpenAbout={() => {
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 2: ANALYZE / RESULT DASHBOARD */}
        {activeTab === 'analyze' && (
          <>
            {isLoading ? (
              <AnalysisLoader imagePreview={loadingPreview} />
            ) : currentResult ? (
              <ResultsDashboard
                result={currentResult}
                onReset={() => {
                  setCurrentResult(null);
                  setErrorMessage(null);
                }}
                onSave={handleSaveResult}
                isSaved={isCurrentResultSaved}
              />
            ) : (
              <UploadCard
                onAnalyze={handleAnalyze}
                onOpenLiveCamera={() => setIsCameraOpen(true)}
                onSelectSample={handleSelectSample}
                isLoading={isLoading}
                errorMessage={errorMessage}
              />
            )}
          </>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectResult={(selected) => {
              setCurrentResult(selected);
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onClearHistory={handleClearHistory}
            onStartNew={() => {
              setCurrentResult(null);
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 4: ABOUT & LEGAL */}
        {activeTab === 'about' && (
          <AboutLegalModal
            onStartAnalysis={() => {
              setCurrentResult(null);
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
      />

      {/* Camera Live Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Mobile Floating Bottom Dock (hidden on medium & large desktop screens) */}
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
