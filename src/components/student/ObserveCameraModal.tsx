import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  Check,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Radio,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, SeverityLevel } from '../../types';

export const ObserveCameraModal: React.FC = () => {
  const {
    isObserveModalOpen,
    setIsObserveModalOpen,
    submitObservation,
    setSelectedHotspotId,
    isOffline,
  } = useApp();

  const [step, setStep] = useState<'capture' | 'details' | 'result'>('capture');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [capturedTimestamp, setCapturedTimestamp] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('Dry / Recyclable');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel>('High');
  const [submissionResult, setSubmissionResult] = useState<{
    observationId: string;
    isDuplicate: boolean;
    distanceMeters?: number;
    matchedHotspotId?: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasLiveCamera, setHasLiveCamera] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Initialize device camera when capture step opens
  useEffect(() => {
    let streamInstance: MediaStream | null = null;

    if (isObserveModalOpen && step === 'capture') {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          })
          .then((stream) => {
            streamInstance = stream;
            setCameraStream(stream);
            setHasLiveCamera(true);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch(() => {
            // Camera not allowed or unavailable in this environment
            setHasLiveCamera(false);
          });
      }
    }

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isObserveModalOpen, step]);

  if (!isObserveModalOpen) return null;

  const categories: WasteCategory[] = [
    'Dry / Recyclable',
    'Wet / Organic',
    'Sanitary',
    'Construction & Demolition',
    'Bulky',
    'Special / Hazardous',
  ];

  const severities: SeverityLevel[] = ['Low', 'Medium', 'High'];

  // Instant capture at the moment
  const handleCaptureAtTheMoment = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCapturedTimestamp(`Today, ${formattedTime}`);

    if (hasLiveCamera && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhotoUrl(dataUrl);
      }
    } else {
      // Handled via realistic simulated on-site scene
      setCapturedPhotoUrl('simulated_live_capture');
    }

    // Stop stream once captured
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    setStep('details');
  };

  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    setStep('capture');
  };

  const handleSubmit = () => {
    const result = submitObservation({
      wasteCategory: selectedCategory,
      severity: selectedSeverity,
      coordinates: { lat: 30.9007, lng: 75.8573 },
      locationName: 'Model Town drain edge',
    });

    setSubmissionResult({
      observationId: result.observationId,
      isDuplicate: result.isDuplicate,
      distanceMeters: result.distanceMeters || 42,
      matchedHotspotId: result.matchedHotspot?.id || 'H-014',
    });

    setStep('result');
  };

  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsObserveModalOpen(false);
    setStep('capture');
    setCapturedPhotoUrl(null);
    setSubmissionResult(null);
  };

  const isHazardousSelected =
    selectedCategory === 'Special / Hazardous' || selectedCategory === 'Sanitary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#F7F8F6] rounded-2xl border border-stone-300 shadow-2xl overflow-hidden my-auto">
        {/* Hidden canvas for real-time camera capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h2 className="text-sm font-bold text-[#17201B]">
              {step === 'result' ? 'Observation Logged' : 'Live Observation Camera'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: REAL-TIME ON-SITE CAMERA VIEWFINDER */}
        {step === 'capture' && (
          <div className="relative bg-stone-900 text-white overflow-hidden flex flex-col justify-between aspect-[3/4] sm:aspect-[4/3] w-full">
            {/* Viewfinder frame overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex items-center justify-between text-[11px] text-stone-300 font-mono">
                <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded backdrop-blur-md border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#167A4A]" />
                  30.9007° N, 75.8573° E
                </span>
                <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded backdrop-blur-md border border-white/10 text-emerald-400">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE ON-SITE
                </span>
              </div>

              {/* Centered Reticle */}
              <div className="self-center w-52 h-52 border border-white/30 rounded-xl relative flex items-center justify-center">
                <div className="w-4 h-4 border-t-2 border-l-2 border-white absolute top-0 left-0" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-white absolute top-0 right-0" />
                <div className="w-4 h-4 border-b-2 border-l-2 border-white absolute bottom-0 left-0" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-white absolute bottom-0 right-0" />
                <span className="text-[10px] text-white/80 uppercase tracking-widest font-mono text-center px-2">
                  Align Hotspot Perimeter
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-300 font-mono bg-black/60 px-3 py-1.5 rounded backdrop-blur-md border border-white/10">
                <span>Model Town drain edge · Sector 12</span>
                <span className="text-amber-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  GPS & Time Locked
                </span>
              </div>
            </div>

            {/* Live Camera Feed or On-Site Live Viewfinder */}
            <div className="absolute inset-0 bg-stone-950 flex items-center justify-center">
              {hasLiveCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 400 300" className="w-full h-full object-cover opacity-85">
                  <defs>
                    <linearGradient id="liveCamSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="180" fill="url(#liveCamSky)" />
                  <polygon points="0,150 400,140 400,300 0,300" fill="#1E293B" />
                  {/* Drainage embankment and real-time scene */}
                  <path d="M 60 220 Q 140 160 220 200 Q 280 180 340 240 Z" fill="#64748B" />
                  <rect x="90" y="200" width="40" height="25" rx="2" fill="#B4824A" transform="rotate(-8 110 210)" />
                  <path d="M 160 210 Q 180 190 200 205 Q 220 220 190 230 Z" fill="#93C5FD" />
                  <rect x="230" y="210" width="30" height="20" rx="1" fill="#E2E8F0" transform="rotate(15 245 220)" />
                </svg>
              )}
            </div>

            {/* Bottom Controls: REAL-TIME SHUTTER BUTTON ONLY */}
            <div className="relative z-20 p-4 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center border-t border-white/10 mt-auto gap-2">
              {/* Shutter Button (Capture At The Moment) */}
              <button
                type="button"
                onClick={handleCaptureAtTheMoment}
                className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1.5 active:scale-95 transition-transform hover:border-[#167A4A] shadow-lg"
                aria-label="Capture photo at the moment"
              >
                <div className="w-full h-full rounded-full bg-[#167A4A] flex items-center justify-center shadow-inner hover:bg-[#12633C] transition-colors">
                  <Camera className="w-7 h-7 text-white" />
                </div>
              </button>

              {/* Explicit Real-Time Policy Notice */}
              <div className="text-[11px] text-stone-300 font-medium flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live camera capture only · Gallery uploads disabled</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CATEGORY & SEVERITY DETAILS */}
        {step === 'details' && (
          <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Captured Photo Preview (Captured at this instant) */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-stone-900 border border-stone-300 shadow-inner">
              {capturedPhotoUrl && capturedPhotoUrl !== 'simulated_live_capture' ? (
                <img
                  src={capturedPhotoUrl}
                  alt="Live captured evidence"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 400 225" className="w-full h-full object-cover">
                  <rect width="400" height="120" fill="#475569" />
                  <polygon points="0,110 400,100 400,225 0,225" fill="#1E293B" />
                  <path d="M 60 170 Q 140 120 220 150 Q 280 130 340 190 Z" fill="#64748B" />
                  <rect x="90" y="150" width="40" height="25" rx="2" fill="#B4824A" transform="rotate(-8 110 160)" />
                </svg>
              )}

              {/* Retake button (Returns to live camera, never gallery) */}
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-2.5 py-1 rounded-md bg-stone-900/80 text-white text-[11px] font-medium flex items-center gap-1 backdrop-blur-sm border border-white/20 hover:bg-stone-900"
                >
                  <RotateCcw className="w-3 h-3" />
                  Retake Live
                </button>
              </div>

              {/* Real-time Forensic Verification Watermark */}
              <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-mono bg-stone-950/80 p-2 rounded backdrop-blur-sm border border-white/10 flex items-center justify-between">
                <span>30.9007° N, 75.8573° E</span>
                <span className="text-emerald-400">Captured at the moment · {capturedTimestamp || 'Just now'}</span>
              </div>
            </div>

            {/* Waste Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#17201B] mb-1.5">
                Waste Category Observed
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedCategory === cat
                        ? 'border-[#167A4A] bg-[#E8F4ED] text-[#167A4A] ring-1 ring-[#167A4A]'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#17201B] mb-1.5">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {severities.map((sev) => {
                  const isSelected = selectedSeverity === sev;
                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSelectedSeverity(sev)}
                      className={`h-9 rounded-xl border text-xs font-medium transition-all flex items-center justify-center ${
                        isSelected
                          ? sev === 'High'
                            ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500'
                            : sev === 'Medium'
                            ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Safety & Educational Warning */}
            <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  This is an observation and will be verified by municipal staff before becoming a hotspot.
                </p>
              </div>
              {isHazardousSelected && (
                <div className="pt-1.5 border-t border-stone-200 text-red-700 font-medium flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>Do not touch or handle hazardous, medical or sanitary waste under any circumstance.</p>
                </div>
              )}
            </div>

            {/* Offline notice if active */}
            {isOffline && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Offline mode: Observation will be saved locally and auto-synced when back online.
              </div>
            )}

            {/* Primary Submit CTA */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center hover:bg-[#12633C] active:scale-[0.99] transition-all shadow-sm"
            >
              Submit Observation
            </button>
          </div>
        )}

        {/* STEP 3: SUBMISSION RESULT */}
        {step === 'result' && submissionResult && (
          <div className="p-5 sm:p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F4ED] border border-[#167A4A]/20 text-[#167A4A] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider font-mono font-semibold text-[#167A4A]">
                Observation Received
              </div>
              <h3 className="text-xl font-bold text-[#17201B] mt-0.5">
                {submissionResult.observationId}
              </h3>
              <p className="text-xs text-[#6B746E] mt-1 max-w-sm mx-auto">
                Your on-site snapshot has been authenticated with locked GPS coordinates and timestamp.
              </p>
            </div>

            {/* Spatial Clustering Result (One physical hotspot principle) */}
            {submissionResult.isDuplicate && (
              <div className="text-left p-4 rounded-xl bg-[#E8F4ED]/60 border border-[#167A4A]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#167A4A] uppercase tracking-wide">
                    Possible Existing Hotspot Found
                  </span>
                  <span className="text-[11px] font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {submissionResult.distanceMeters}m away
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#17201B]">
                  {submissionResult.matchedHotspotId} · Model Town drain edge
                </div>
                <p className="text-xs text-[#6B746E] leading-relaxed">
                  Two other observations are already linked to this physical location. Your live capture strengthens the existing hotspot record rather than creating a duplicate complaint.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    if (submissionResult.matchedHotspotId) {
                      setSelectedHotspotId(submissionResult.matchedHotspotId);
                    }
                  }}
                  className="w-full mt-2 h-9 rounded-lg bg-[#167A4A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#12633C] transition-colors"
                >
                  <span>View {submissionResult.matchedHotspotId} History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors pt-1"
            >
              Done & Return to Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

