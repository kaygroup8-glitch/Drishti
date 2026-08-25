import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsStarting(true);
    setErrorMsg(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg('Could not access camera. Please check browser permissions or upload a photo.');
    } finally {
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    onCapture(dataUrl);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#1A1C20] text-[#FAF6EE] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#373A42] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#2E313A]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FA8F79]" />
            <span className="font-bold font-heading text-base">Capture Space Photo</span>
          </div>
          <button
            id="camera-close-btn"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[#2E313A] text-[#9CA3AF] hover:text-[#FAF6EE]"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-[#FA8F79] mx-auto" />
              <p className="text-sm text-[#E5E7EB]">{errorMsg}</p>
              <button
                id="camera-retry-btn"
                onClick={startCamera}
                className="px-4 py-2 bg-[#2E313A] hover:bg-[#3D414D] rounded-xl text-xs font-semibold"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Frame Guideline Overlay */}
              <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] text-white/60 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Align space, threshold, or interface
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-5 flex items-center justify-between bg-[#15171A]">
          <button
            id="camera-flip-btn"
            onClick={toggleFacingMode}
            className="p-3 rounded-full bg-[#2A2D36] hover:bg-[#383C47] text-[#FAF6EE] transition-colors"
            title="Switch front/back camera"
            aria-label="Switch camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            id="camera-shutter-btn"
            disabled={Boolean(errorMsg) || isStarting}
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full bg-[#FA8F79] hover:bg-[#F9775E] text-[#1A1C20] flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            aria-label="Take photo"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#1A1C20] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#1A1C20]"></div>
            </div>
          </button>

          <button
            id="camera-cancel-btn"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-xs font-semibold text-[#9CA3AF] hover:text-[#FAF6EE] px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
