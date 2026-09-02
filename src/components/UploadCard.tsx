import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  ScanSearch,
  X,
  Check,
  AlertCircle,
  ArrowRight,
  ImageIcon,
} from 'lucide-react';
import { LENSES } from '../utils/lensConfig';
import { LensId, SampleScenario } from '../types';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { optimizeImageForAnalysis } from '../utils/imageOptimizer';
import darkCameraImg from '../assets/images/dark_camera_cinematic_1788379424968.jpg';

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
      // Fast client-side resizing down to max 1280px for instant analysis
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
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1A1C20] tracking-tight">
          Accessibility Scan
        </h1>
        <p className="text-sm sm:text-base text-[#615A4D] leading-relaxed">
          Upload any photo of an entrance, doorway, ramp, staircase, or corridor to analyze accessibility barriers.
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
              onClick={() => fileInputRef.current?.click()}
              className={`group relative overflow-hidden rounded-[28px] border border-white/15 hover:border-white/35 bg-[#090B0E] p-8 sm:p-10 flex flex-col justify-between min-h-[380px] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                isDragging ? 'border-[#FA8F79] ring-2 ring-[#FA8F79]/40' : ''
              }`}
            >
              {/* High Quality Cinematic Background Image */}
              <img
                src={darkCameraImg}
                alt="Capture Space"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Un-dimmed Subtle Gradient Overlay - keeps image bright and vivid while protecting text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-50% to-black/10 z-0" />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />

              {/* Clean Top Tag */}
              <div className="z-10 relative">
                <span className="text-[11px] font-mono font-bold tracking-wider text-white/95 uppercase px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 inline-flex items-center shadow-sm">
                  Photo Upload
                </span>
              </div>

              {/* Center Content */}
              <div className="z-10 relative my-6 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white group-hover:text-[#FA8F79] transition-colors drop-shadow-md">
                  Drop image or browse
                </h2>
                <p className="text-xs sm:text-sm text-[#E2DCD2] leading-relaxed max-w-[85%] sm:max-w-[78%]">
                  Upload JPG, PNG, or WEBP. Well-lit photos of thresholds, ramps, stairs, and doors provide the highest accuracy.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <span className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1A1C20] text-xs font-bold shadow-md transition-colors">
                    {isOptimizing ? 'Preparing...' : 'Choose Photo'}
                  </span>
                  <button
                    type="button"
                    id="camera-open-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLiveCamera();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20 backdrop-blur-md shadow-xs cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#FA8F79]" />
                    <span>Camera</span>
                  </button>
                </div>
              </div>

              {/* Bottom Action Hint */}
              <div className="z-10 relative pt-3 border-t border-white/10">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-[#FA8F79] transition-colors">
                  <span>Browse device photos</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-white/70 group-hover:text-[#FA8F79]" />
                </span>
              </div>
            </div>
          ) : (
            /* Selected Preview Card */
            <div className="relative overflow-hidden rounded-[28px] bg-[#FAF7F0] border border-[#E7DECD] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#524C41]">
                  Selected Photo
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-[#FA8F79] hover:underline cursor-pointer"
                >
                  Change photo
                </button>
              </div>

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
            </div>
          )}

          {/* Quick Sample Selector Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold tracking-wide text-[#665F51]">
                Or select a sample space:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_SCENARIOS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  id={`quick-sample-${sample.id}`}
                  onClick={() => onSelectSample(sample)}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-[#E5DAC8] p-4 text-left transition-all hover:shadow-sm hover:border-[#D6C4AD] cursor-pointer flex flex-col justify-between min-h-[105px]"
                >
                  <div className="z-10 relative space-y-1">
                    <span className="text-[11px] font-semibold text-[#8C8475]">
                      {sample.category}
                    </span>
                    <p className="text-xs font-bold text-[#1A1C20] group-hover:text-[#FA8F79] transition-colors truncate">
                      {sample.title}
                    </p>
                  </div>

                  <div className="z-10 relative pt-2 flex items-center justify-between text-[11px] font-bold text-[#1A1C20] group-hover:text-[#FA8F79] transition-colors border-t border-[#000000]/5">
                    <span>Score {sample.result.accessibilityScore}/100</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Lens Settings & Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="group relative overflow-hidden rounded-[28px] bg-white border border-[#E5DAC8] p-7 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between min-h-[380px]">
            {/* Top Section */}
            <div className="z-10 relative space-y-1">
              <span className="text-xs font-semibold text-[#4D7C66]">
                Configuration
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#1A1C20]">
                Select Lenses
              </h2>
              <p className="text-xs sm:text-sm text-[#544D40] leading-relaxed pt-1">
                Choose specific accessibility perspectives or analyze across all 6 universal lenses.
              </p>
            </div>

            {/* Lens selection chips */}
            <div className="z-10 relative flex flex-wrap gap-2">
              {LENSES.map((lens) => {
                const isSelected = selectedLenses.includes(lens.id);
                return (
                  <button
                    key={lens.id}
                    type="button"
                    id={`lens-pill-${lens.id}`}
                    onClick={() => toggleLens(lens.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1C20] text-[#FAF6EE] shadow-xs'
                        : 'bg-[#FAF7F0] hover:bg-[#F2ECE1] text-[#4F4A3F] border border-[#DDD3C2] hover:border-[#805D26]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FA8F79]" />}
                    <span>{lens.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Analysis Action Button */}
            <div className="z-10 relative pt-4 border-t border-[#E5DAC8] space-y-3">
              <button
                type="button"
                id="reveal-barriers-btn"
                disabled={!filePreview || isLoading}
                onClick={handleSubmit}
                className={`w-full py-4 rounded-2xl font-bold font-heading text-base flex items-center justify-center gap-3 transition-all shadow-md ${
                  filePreview && !isLoading
                    ? 'bg-[#1A1C20] hover:bg-[#2C2E35] text-[#FAF6EE] cursor-pointer hover:shadow-lg active:scale-[0.99]'
                    : 'bg-[#E5DAC8]/70 text-[#9E9585] cursor-not-allowed'
                }`}
              >
                <ScanSearch className="w-5 h-5 text-[#FA8F79]" />
                <span>{isLoading ? 'Scanning with Gemini...' : 'Analyze Space'}</span>
                {filePreview && !isLoading && <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />}
              </button>

              <p className="text-center text-[11px] text-[#736C5E]">
                AI pinpoints obstacles with precise coordinates and practical fixes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
