import React, { useState } from 'react';
import { Search, MapPin, Navigation, ChevronRight, ArrowRight, Eye, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Hotspot } from '../../types';

export const HotspotMap: React.FC = () => {
  const { hotspots, setSelectedHotspotId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Verified' | 'Needs Action' | 'Recurring' | 'Follow-up'>('All');
  const [activePinHotspot, setActivePinHotspot] = useState<Hotspot | null>(hotspots[0]);

  const filters = ['All', 'Verified', 'Needs Action', 'Recurring', 'Follow-up'] as const;

  const filteredHotspots = hotspots.filter((h) => {
    // Search filter
    const matchesSearch =
      h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.landmark.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Verified') return h.status === 'Verified';
    if (selectedFilter === 'Needs Action') return h.status === 'Assigned' || h.severity === 'High';
    if (selectedFilter === 'Recurring') return h.isRecurring || h.status === 'Recurring';
    if (selectedFilter === 'Follow-up') return h.status === 'Needs Follow-up' || h.timeline.some((t) => t.stage === 'Follow-up');
    return true;
  });

  // Calculate pin coordinates inside SVG map viewport (400 x 280)
  const getPinPosition = (id: string) => {
    switch (id) {
      case 'H-014':
        return { x: 190, y: 130 }; // Center-left drain canal
      case 'H-027':
        return { x: 280, y: 80 }; // Top-right Market Road
      case 'H-032':
        return { x: 90, y: 190 }; // Bottom-left Riverside
      case 'H-009':
        return { x: 170, y: 95 }; // Near campus garden
      case 'H-045':
        return { x: 310, y: 160 }; // Bus Terminus
      default:
        return { x: 200, y: 140 };
    }
  };

  const getPinColor = (spot: Hotspot) => {
    if (spot.status === 'Sustained Clean') return '#167A4A'; // Green = stable
    if (spot.isRecurring || spot.severity === 'High') return '#DC2626'; // Red = recurring / high
    return '#D97706'; // Amber = needs attention
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Top Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search location or Hotspot ID (e.g. H-014)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none shadow-sm"
          />
        </div>

        {/* Filter chips (functional buttons with active state) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === f
                  ? 'bg-[#167A4A] text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Clean Vector Map Canvas */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-[#E8EAE6] rounded-2xl border border-stone-200 shadow-sm overflow-hidden select-none">
        {/* SVG Street and River Grid */}
        <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
          <defs>
            <pattern id="civicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D8DBD6" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Base terrain */}
          <rect width="400" height="240" fill="#E8EAE6" />
          <rect width="400" height="240" fill="url(#civicGrid)" />

          {/* Green municipal parks */}
          <path d="M 140 70 Q 180 60 190 100 Q 170 120 140 100 Z" fill="#D3E6DA" opacity="0.8" />
          <text x="145" y="85" fill="#167A4A" fontSize="8" fontWeight="600" opacity="0.7">SECTOR 4 GREEN</text>

          {/* Water drainage canal (H-014 location) */}
          <path
            d="M 0 160 Q 120 150 200 135 T 400 120"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 0 160 Q 120 150 200 135 T 400 120"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* Main Civic Arterial Roads */}
          {/* North-South corridor */}
          <path d="M 120 0 L 120 240" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M 120 0 L 120 240" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6 4" />

          {/* Diagonal Market Road */}
          <path d="M 50 240 L 350 40" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M 50 240 L 350 40" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="8 6" />

          {/* East-West bypass */}
          <path d="M 0 100 L 400 100" stroke="#FFFFFF" strokeWidth="8" />

          {/* Road labels */}
          <text x="250" y="85" fill="#64748B" fontSize="8" fontWeight="600" transform="rotate(-33 250 85)">
            MARKET ROAD
          </text>
          <text x="125" y="40" fill="#64748B" fontSize="8" fontWeight="600" transform="rotate(90 125 40)">
            CIVIC MARG
          </text>
          <text x="15" y="152" fill="#64748B" fontSize="8" fontWeight="600">
            MODEL TOWN DRAIN
          </text>

          {/* User Location Pulse (Blue = current location / school campus) */}
          <g transform="translate(155, 110)">
            <circle cx="0" cy="0" r="14" fill="#3B82F6" opacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <text x="10" y="3" fill="#1E40AF" fontSize="8" fontWeight="bold">You (School Zone)</text>
          </g>

          {/* Render Hotspot Pins */}
          {filteredHotspots.map((spot) => {
            const pos = getPinPosition(spot.id);
            const color = getPinColor(spot);
            const isSelected = activePinHotspot?.id === spot.id;

            return (
              <g
                key={spot.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setActivePinHotspot(spot)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                {/* Ping on high priority / recurring */}
                {spot.severity === 'High' && (
                  <circle cx="0" cy="0" r="16" fill={color} opacity="0.2" className="animate-pulse" />
                )}

                {/* Minimal Map Pin Marker */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 11 : 9}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="shadow-md"
                />

                {/* Hotspot ID label tag on map */}
                <rect
                  x="-18"
                  y="-22"
                  width="36"
                  height="14"
                  rx="3"
                  fill="#17201B"
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="-12"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {spot.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-stone-200 text-[10px] text-stone-600 space-y-1 shadow-sm hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#167A4A]" />
            <span>Green = Sustained clean / Stable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span>Amber = Assigned / In progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span>Red = Recurring / High priority</span>
          </div>
        </div>

        {/* Section 39: Contextual Mobile Bottom Card (Tapping a pin opens small bottom card) */}
        {activePinHotspot && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200 shadow-lg animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-[#167A4A]">
                    {activePinHotspot.id}
                  </span>
                  <span className="text-xs font-bold text-[#17201B]">
                    {activePinHotspot.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B746E] mt-0.5">
                  <span>{activePinHotspot.distanceKm} km</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePinHotspot.primaryWaste}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      activePinHotspot.severity === 'High'
                        ? 'text-red-700 font-semibold'
                        : 'text-stone-600'
                    }
                  >
                    {activePinHotspot.severity} Priority
                  </span>
                </div>
              </div>

              {activePinHotspot.isRecurring && (
                <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 shrink-0">
                  Recurring ({activePinHotspot.recurrenceCount}x)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedHotspotId(activePinHotspot.id)}
              className="mt-3 w-full h-8 rounded-lg bg-[#167A4A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#12633C] transition-colors"
            >
              <span>View Hotspot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Hotspots List Below Map */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#17201B]">Nearby Hotspots</h2>
          <span className="text-xs text-stone-500 font-mono">
            {filteredHotspots.length} FOUND
          </span>
        </div>

        <div className="space-y-2">
          {filteredHotspots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => {
                setActivePinHotspot(spot);
                setSelectedHotspotId(spot.id);
              }}
              className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-[#167A4A]/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#167A4A]">
                    {spot.id}
                  </span>
                  <span className="text-xs font-bold text-[#17201B] truncate">
                    {spot.locationName}
                  </span>
                  {spot.isRecurring && (
                    <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                      Recurring
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#6B746E] mt-0.5">
                  <span>{spot.distanceKm} km</span>
                  <span aria-hidden="true">·</span>
                  <span>{spot.primaryWaste}</span>
                  <span aria-hidden="true">·</span>
                  <span>Severity: {spot.severity}</span>
                  <span aria-hidden="true">·</span>
                  <span>{spot.status}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
