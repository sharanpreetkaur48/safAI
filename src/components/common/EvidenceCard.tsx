import React, { useState } from 'react';
import { Camera, MapPin, Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Eye, X } from 'lucide-react';

interface EvidenceCardProps {
  type: 'before' | 'after' | 'activity' | 'handover';
  title?: string;
  timestamp?: string;
  location?: string;
  coords?: string;
  actor?: string;
  variant?: 'thumbnail' | 'hero' | 'gallery';
  imageTag?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  type,
  title,
  timestamp = '24 Apr · 10:42 AM',
  location = 'Model Town drain edge',
  coords = '30.9007° N, 75.8573° E',
  actor = 'Field Log #EV-8841',
  variant = 'gallery',
  imageTag = 'drain_canal',
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const getBadgeDetails = () => {
    switch (type) {
      case 'before':
        return {
          label: 'Before Clearance',
          color: 'text-amber-800 bg-amber-50 border-amber-200',
          icon: AlertTriangle,
          bgGradient: 'from-amber-950/80 via-stone-900/60 to-stone-950/90',
          accent: '#D97706',
        };
      case 'after':
        return {
          label: 'After Clearance',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          icon: CheckCircle2,
          bgGradient: 'from-emerald-950/80 via-stone-900/60 to-stone-950/90',
          accent: '#167A4A',
        };
      case 'activity':
        return {
          label: 'Eco Club Activity',
          color: 'text-blue-800 bg-blue-50 border-blue-200',
          icon: ShieldCheck,
          bgGradient: 'from-sky-950/80 via-stone-900/60 to-stone-950/90',
          accent: '#0284C7',
        };
      case 'handover':
        return {
          label: 'Municipal Handover',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          icon: CheckCircle2,
          bgGradient: 'from-teal-950/80 via-stone-900/60 to-stone-950/90',
          accent: '#0D9488',
        };
    }
  };

  const badge = getBadgeDetails();
  const Icon = badge.icon;

  // Visual SVG artwork representing realistic municipal and student documentary field photos
  const renderVisualIllustration = () => {
    if (type === 'before') {
      return (
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9D6CE" />
              <stop offset="60%" stopColor="#E2E8E4" />
              <stop offset="100%" stopColor="#D5DDD8" />
            </linearGradient>
            <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8C8E8B" />
              <stop offset="50%" stopColor="#727572" />
              <stop offset="100%" stopColor="#5E615E" />
            </linearGradient>
            <linearGradient id="canalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A4E4B" />
              <stop offset="100%" stopColor="#2E3330" />
            </linearGradient>
            <pattern id="brick" width="20" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 20 10 M 10 0 L 10 10 M 0 0 L 20 0" fill="none" stroke="#686B68" strokeWidth="0.5" />
            </pattern>
          </defs>
          {/* Sky / Background Urban Wall */}
          <rect width="400" height="140" fill="url(#skyGrad)" />
          {/* Background Wall */}
          <rect x="0" y="40" width="400" height="90" fill="url(#wallGrad)" />
          <rect x="0" y="40" width="400" height="90" fill="url(#brick)" opacity="0.4" />
          {/* Concrete drainage bank embankment */}
          <polygon points="0,120 400,110 400,180 0,200" fill="#9CA3AF" />
          <polygon points="0,170 400,160 400,240 0,240" fill="url(#canalGrad)" />
          {/* Realistic Waste Accumulation (cartons, plastics, sacks) */}
          <g transform="translate(40, 115)">
            {/* Discarded cartons */}
            <rect x="20" y="10" width="55" height="35" rx="2" fill="#B4824A" transform="rotate(-6 45 25)" />
            <line x1="20" y1="26" x2="75" y2="22" stroke="#8A5A2B" strokeWidth="1" />
            <rect x="65" y="18" width="45" height="28" rx="2" fill="#9C6B38" transform="rotate(12 85 30)" />
            {/* Crushed plastics & bags */}
            <path d="M 120 30 Q 140 10 160 25 Q 180 40 150 50 Z" fill="#E2E8F0" opacity="0.9" />
            <path d="M 135 25 Q 155 18 165 35 Z" fill="#3B82F6" opacity="0.85" />
            <path d="M 180 20 Q 210 15 220 38 Q 200 48 175 42 Z" fill="#EAB308" opacity="0.8" />
            {/* Scattered packaging debris */}
            <ellipse cx="240" cy="40" rx="35" ry="18" fill="#CBD5E1" />
            <ellipse cx="270" cy="38" rx="25" ry="14" fill="#94A3B8" />
            <circle cx="310" cy="45" r="8" fill="#EF4444" opacity="0.75" />
            <rect x="290" y="25" width="30" height="20" rx="3" fill="#A8A29E" transform="rotate(24 305 35)" />
          </g>
          {/* Water reflection line */}
          <path d="M 0 215 Q 100 212 200 216 T 400 214" fill="none" stroke="#64748B" strokeWidth="1.5" opacity="0.5" />
        </svg>
      );
    }

    if (type === 'after') {
      return (
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="cleanSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4E4DC" />
              <stop offset="80%" stopColor="#EAF2ED" />
            </linearGradient>
            <linearGradient id="cleanWall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#A8B0A9" />
              <stop offset="100%" stopColor="#BDC5BE" />
            </linearGradient>
          </defs>
          {/* Clean Bright Ambience */}
          <rect width="400" height="140" fill="url(#cleanSky)" />
          {/* Swept Wall & Clean Concrete */}
          <rect x="0" y="40" width="400" height="90" fill="url(#cleanWall)" />
          <polygon points="0,120 400,110 400,180 0,200" fill="#CBD5E1" />
          <polygon points="0,170 400,160 400,240 0,240" fill="#475569" />
          {/* Clean Swept Texture Lines */}
          <path d="M 30 145 L 380 135" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="6 4" />
          <path d="M 20 165 L 390 155" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="10 5" />
          {/* Installed Twin Waste Bins on Concrete Bank */}
          <g transform="translate(160, 95)">
            {/* Green Bin (Wet) */}
            <rect x="0" y="10" width="28" height="42" rx="4" fill="#167A4A" />
            <rect x="-2" y="6" width="32" height="6" rx="2" fill="#14532D" />
            {/* Blue Bin (Dry Recyclable) */}
            <rect x="36" y="10" width="28" height="42" rx="4" fill="#0284C7" />
            <rect x="34" y="6" width="32" height="6" rx="2" fill="#0369A1" />
            {/* Municipal Stencil */}
            <rect x="6" y="24" width="16" height="3" fill="#FFFFFF" opacity="0.6" />
            <rect x="42" y="24" width="16" height="3" fill="#FFFFFF" opacity="0.6" />
          </g>
          {/* Clear water flow */}
          <path d="M 0 205 Q 120 202 240 207 T 400 204" fill="none" stroke="#94A3B8" strokeWidth="2" opacity="0.6" />
        </svg>
      );
    }

    if (type === 'activity') {
      return (
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="actBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#actBg)" />
          {/* Ground pavement */}
          <polygon points="0,150 400,135 400,240 0,240" fill="#94A3B8" opacity="0.5" />
          {/* Segregation Sacks (Blue for dry, Green for organic) */}
          <g transform="translate(60, 110)">
            {/* Sacks standing */}
            <ellipse cx="60" cy="65" rx="32" ry="45" fill="#0284C7" />
            <ellipse cx="60" cy="25" rx="20" ry="8" fill="#0369A1" />
            <text x="46" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold">DRY</text>

            <ellipse cx="140" cy="65" rx="30" ry="42" fill="#167A4A" />
            <ellipse cx="140" cy="28" rx="18" ry="7" fill="#14532D" />
            <text x="126" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold">WET</text>

            {/* Weighing scale representation */}
            <rect x="210" y="55" width="50" height="40" rx="3" fill="#334155" />
            <rect x="220" y="62" width="30" height="15" rx="1" fill="#0F172A" />
            <text x="225" y="73" fill="#22C55E" fontSize="9" fontFamily="monospace">72.4kg</text>
          </g>
          {/* Students silhouette / teacher guidance indicators */}
          <g transform="translate(290, 80)">
            <circle cx="20" cy="20" r="14" fill="#475569" />
            <path d="M 0 50 Q 20 38 40 50 L 40 90 L 0 90 Z" fill="#334155" />
            {/* Volunteer arm band */}
            <rect x="2" y="52" width="10" height="6" fill="#167A4A" />
          </g>
        </svg>
      );
    }

    // Handover representation
    return (
      <svg
        viewBox="0 0 400 240"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="240" fill="#E2E8F0" />
        <polygon points="0,140 400,130 400,240 0,240" fill="#64748B" />
        {/* Municipal Collection Tipper Truck */}
        <g transform="translate(80, 85)">
          {/* Truck Body */}
          <rect x="60" y="0" width="170" height="75" rx="4" fill="#167A4A" />
          {/* Driver Cabin */}
          <path d="M 230 20 L 265 20 L 275 48 L 275 75 L 230 75 Z" fill="#0F766E" />
          <rect x="240" y="26" width="22" height="18" rx="2" fill="#E2E8F0" />
          {/* Wheels */}
          <circle cx="100" cy="78" r="18" fill="#1E293B" />
          <circle cx="100" cy="78" r="7" fill="#94A3B8" />
          <circle cx="240" cy="78" r="18" fill="#1E293B" />
          <circle cx="240" cy="78" r="7" fill="#94A3B8" />
          {/* Municipal Stencil Text */}
          <text x="75" y="42" fill="#FFFFFF" fontSize="12" fontWeight="bold" letterSpacing="1">MUNICIPAL CORP</text>
          <text x="75" y="58" fill="#D1FAE5" fontSize="9">WASTE LOGISTICS WARD-12</text>
        </g>
      </svg>
    );
  };

  const isHero = variant === 'hero';

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition-all shadow-sm ${
          isHero ? 'aspect-[16/10] w-full' : 'aspect-[4/3] w-full'
        }`}
      >
        {/* Render Vector Documentary Illustration */}
        <div className="absolute inset-0 z-0 bg-stone-100 flex items-center justify-center">
          {renderVisualIllustration()}
        </div>

        {/* Photometric Scrim overlay (WCAG compliant) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent pointer-events-none" />

        {/* Top Header Stamp */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md bg-stone-900/70 text-white border border-white/15">
            <Icon className="w-3.5 h-3.5" style={{ color: badge.accent }} />
            <span>{badge.label}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            aria-label="Inspect evidence in full view"
            className="w-7 h-7 rounded-md bg-stone-900/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-stone-900/80 flex items-center justify-center transition-colors border border-white/10"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Metadata Ledger (Unboxed zero-pill layout with dot separators) */}
        <div className="absolute bottom-3 left-3 right-3 z-20 text-white">
          <div className="text-sm font-semibold tracking-tight text-white mb-1">
            {title || location}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-300 font-mono">
            <span>{coords}</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>{timestamp}</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span className="text-stone-300">{actor}</span>
          </div>
        </div>
      </div>

      {/* Fullscreen Inspection Lightbox */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 text-white">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: badge.accent }} />
                <span className="font-semibold text-sm">{badge.label} — Forensic Evidence</span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Graphic Container */}
            <div className="aspect-[16/10] w-full relative bg-stone-950">
              {renderVisualIllustration()}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-stone-300 font-mono">
                AUTHENTIC CIVIC AUDIT RECORD
              </div>
            </div>

            {/* Audit Metadata details */}
            <div className="p-4 bg-stone-900 text-stone-200 space-y-2 border-t border-stone-800 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-stone-400 text-[10px] uppercase font-semibold">Location Reference</div>
                  <div className="font-medium text-stone-200 mt-0.5">{location}</div>
                  <div className="text-stone-400 font-mono text-[11px] mt-0.5">{coords}</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[10px] uppercase font-semibold">Timestamp & Officer</div>
                  <div className="font-medium text-stone-200 mt-0.5">{timestamp}</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">{actor}</div>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/80">
                Verified against physical site inspection boundary. One physical hotspot · One continuous history.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
