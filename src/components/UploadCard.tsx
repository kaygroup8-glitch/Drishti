import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  ScanSearch,
  X,
  Check,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { LENSES } from '../utils/lensConfig';
import { LensId, SampleScenario } from '../types';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { optimizeImageForAnalysis } from '../utils/imageOptimizer';

interface UploadCardProps {
  onAnalyze: (imageData: { base64: string; mimeType: string; fileName: string; lenses: string[] }) => void;
  onOpenLiveCamera: () => void;
  onSelectSample: (scenario: SampleScenario) => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onAnalyze,
  onOpenLiveCamera,
  onSelectSample,
  isLoading,
  errorMessage,
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [selectedLenses, setSelectedLenses] = useState<LensId[]>(['all']);
  const [isDragging, setIsDragging] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or WEBP).');
      return;
    }

    setFileName(file.name);
    setIsOptimizing(true);

    try {
      // Smart fast client-side resizing down to max 1280px for instant analysis
      const optimized = await optimizeImageForAnalysis(file, 1280, 0.85);
      setFilePreview(optimized.base64);
      setMimeType(optimized.mimeType);
    } catch (err) {
      console.warn('Image optimization fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
        setMimeType(file.type || 'image/jpeg');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const toggleLens = (lensId: LensId) => {
    if (lensId === 'all') {
      setSelectedLenses(['all']);
      return;
    }

    let updated = selectedLenses.filter((id) => id !== 'all');
    if (updated.includes(lensId)) {
      updated = updated.filter((id) => id !== lensId);
      if (updated.length === 0) {
        updated = ['all'];
      }
    } else {
      updated.push(lensId);
    }
    setSelectedLenses(updated);
  };

  const handleSubmit = () => {
    if (!filePreview) return;

    const textualLenses = selectedLenses.includes('all')
      ? ['all']
      : selectedLenses.map((id) => {
          const found = LENSES.find((l) => l.id === id);
          return found ? found.name : id;
        });

    onAnalyze({
      base64: filePreview,
      mimeType,
      fileName: fileName || 'space_photo.jpg',
      lenses: textualLenses,
    });
  };

  const clearSelection = () => {
    setFilePreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-10 pb-20">
      {/* Studio Header */}
      <div className="space-y-2 text-left max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FA8F79]">
          Drishti Studio
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1A1C20] tracking-tight">
          Accessibility Scan
        </h1>
        <p className="text-sm sm:text-base text-[#615A4D] leading-relaxed">
          Upload any photo of an entrance, hallway, stairs, or public space to analyze accessibility barriers.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] text-[#991B1B] text-sm flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Dropzone & Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!filePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center transition-all cursor-pointer min-h-[360px] flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-[#FA8F79] bg-[#FFF5F2]'
                  : 'border-[#DCD2C0] hover:border-[#FA8F79] bg-[#FAF7F0] hover:bg-[#FFFFFF]'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />

              <div className="max-w-md mx-auto space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-[#F2ECE1] text-[#FA8F79] mx-auto flex items-center justify-center shadow-xs">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold font-heading text-[#1A1C20]">
                    Drop image or browse
                  </h3>
                  <p className="text-xs sm:text-sm text-[#787163]">
                    JPG, PNG, or WEBP. Well-lit photos yield the best results.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <span className="px-5 py-2.5 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-bold shadow-xs">
                    Choose Photo
                  </span>
                  <button
                    type="button"
                    id="camera-open-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLiveCamera();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EBE3D5] hover:bg-[#DFD6C6] text-[#3D382E] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#FA8F79]" />
                    <span>Camera</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Selected Preview */
            <div className="space-y-3 bg-[#FAF7F0] border border-[#E8DEC8] p-5 rounded-3xl shadow-xs">
              <div className="relative rounded-2xl overflow-hidden bg-[#1A1C20] border border-[#DDD3BF] min-h-[320px] max-h-[440px] flex items-center justify-center">
                <img
                  src={filePreview}
                  alt="Space to analyze"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[440px] object-contain"
                />
                <button
                  type="button"
                  id="clear-preview-btn"
                  onClick={clearSelection}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#1A1C20]/80 hover:bg-[#1A1C20] text-[#FAF6EE] backdrop-blur-xs transition-colors cursor-pointer"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 bg-[#1A1C20]/80 text-[#FAF6EE] text-xs px-3.5 py-1.5 rounded-full backdrop-blur-xs font-medium truncate max-w-[80%]">
                  {fileName}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-[#716A5E] px-2 pt-1">
                <span>Ready for analysis</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#FA8F79] font-bold hover:underline cursor-pointer"
                >
                  Replace
                </button>
              </div>
            </div>
          )}

          {/* Quick Sample Selector Bar */}
          <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#544F44]">
                Or test a sample space:
              </span>
              <span className="text-xs text-[#8A8274] font-medium">Instant</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {SAMPLE_SCENARIOS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  id={`quick-sample-${sample.id}`}
                  onClick={() => onSelectSample(sample)}
                  className="p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#FFF9F5] border border-[#E2D8C6] hover:border-[#FA8F79] text-left transition-all group cursor-pointer shadow-xs"
                >
                  <p className="text-xs font-bold text-[#1A1C20] group-hover:text-[#FA8F79] truncate">
                    {sample.title}
                  </p>
                  <p className="text-[11px] text-[#787164] mt-0.5">
                    Score: {sample.result.accessibilityScore}/100
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Lens Settings & Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-3xl p-7 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FA8F79]">
                Filters
              </span>
              <h2 className="text-xl font-bold font-heading text-[#1A1C20]">
                Select Lenses
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6456]">
                Pick specific lenses or analyze across all perspectives.
              </p>
            </div>

            {/* Lens selection chips */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {LENSES.map((lens) => {
                  const isSelected = selectedLenses.includes(lens.id);
                  return (
                    <button
                      key={lens.id}
                      type="button"
                      id={`lens-pill-${lens.id}`}
                      onClick={() => toggleLens(lens.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs ring-2 ring-[#FA8F79]/30'
                          : 'bg-[#FFFFFF] text-[#4F4A3F] border border-[#E2D7C5] hover:bg-[#F2ECE0]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FA8F79]" />}
                      <span>{lens.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Analysis Action Button */}
            <div className="pt-4 border-t border-[#EBE1CF] space-y-3">
              <button
                type="button"
                id="reveal-barriers-btn"
                disabled={!filePreview || isLoading}
                onClick={handleSubmit}
                className={`w-full py-4 rounded-2xl font-bold font-heading text-base flex items-center justify-center gap-3 transition-all shadow-md ${
                  filePreview && !isLoading
                    ? 'bg-[#FA8F79] hover:bg-[#F9775E] text-[#1A1C20] cursor-pointer hover:shadow-lg active:scale-[0.99]'
                    : 'bg-[#E3DAC8] text-[#8F8778] cursor-not-allowed'
                }`}
              >
                <ScanSearch className="w-5 h-5" />
                <span>{isLoading ? 'Scanning with Gemini...' : 'Analyze Space'}</span>
                {filePreview && !isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-center text-[11px] text-[#857D6F]">
                AI pinpoints obstacles and suggests practical improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
