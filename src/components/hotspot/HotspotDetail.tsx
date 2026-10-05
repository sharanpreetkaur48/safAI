import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Users,
  ShieldCheck,
  Truck,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EvidenceCard } from '../common/EvidenceCard';
import { HotspotTimelineEvent } from '../../types';

export const HotspotDetail: React.FC = () => {
  const {
    currentHotspot,
    setSelectedHotspotId,
    setIsAssignModalOpen,
    setAssignTargetHotspot,
    role,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'evidence' | 'details' | 'history'>('timeline');

  if (!currentHotspot) return null;

  const lifecycleStages = [
    { id: 'Observed', label: 'Observed' },
    { id: 'Verified', label: 'Verified' },
    { id: 'Actioned', label: 'Actioned' },
    { id: 'Follow-up', label: 'Follow-up' },
    { id: 'Sustained Clean', label: 'Sustained Clean' },
  ];

  const getCurrentLifecycleIndex = () => {
    switch (currentHotspot.status) {
      case 'Observed':
        return 0;
      case 'Verified':
      case 'Assigned':
        return 1;
      case 'Actioned':
        return 2;
      case 'Needs Follow-up':
      case 'Recurring':
        return 3;
      case 'Sustained Clean':
        return 4;
      default:
        return 1;
    }
  };

  const currentStageIndex = getCurrentLifecycleIndex();

  const getStatusBadge = () => {
    if (currentHotspot.status === 'Sustained Clean') {
      return (
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Sustained Clean
        </span>
      );
    }
    if (currentHotspot.isRecurring) {
      return (
        <span className="text-xs font-semibold text-red-800 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1">
          <RotateCcw className="w-3.5 h-3.5" />
          Recurring ({currentHotspot.recurrenceCount}x)
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
        {currentHotspot.status}
      </span>
    );
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-16 animate-in fade-in duration-150">
      {/* Top Header with Back button and Persistent ID */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedHotspotId(null)}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono text-[#167A4A]">
                {currentHotspot.id}
              </span>
              <span className="text-sm font-semibold text-[#17201B]">
                {currentHotspot.name}
              </span>
            </div>
            <p className="text-xs text-[#6B746E]">
              {currentHotspot.landmark}
            </p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {/* Hero Documentary Image Record */}
      <div className="space-y-1">
        <EvidenceCard
          type={currentHotspot.status === 'Sustained Clean' ? 'after' : 'before'}
          title={`${currentHotspot.id} Physical Site Record`}
          location={currentHotspot.locationName}
          coords={`${currentHotspot.coordinates.lat}° N, ${currentHotspot.coordinates.lng}° E`}
          actor={`Persistent Ward Record · ${currentHotspot.ward}`}
          timestamp={currentHotspot.lastUpdated}
          variant="hero"
        />
        <div className="flex items-center justify-between text-[11px] text-[#6B746E] px-1 pt-1">
          <span>{currentHotspot.distanceKm} km from school campus</span>
          <span className="font-semibold text-red-700">{currentHotspot.severity} Priority</span>
          <span>Waste: {currentHotspot.primaryWaste}</span>
        </div>
      </div>

      {/* Horizontal Lifecycle Tracker (Section 15) */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
        <div className="text-[11px] font-mono uppercase text-stone-500 font-semibold mb-3">
          Lifecycle Progression (One Continuous History)
        </div>

        <div className="relative flex items-center justify-between">
          {/* Subtle connecting bar */}
          <div className="absolute left-2 right-2 top-3 h-0.5 bg-stone-200 z-0" />
          <div
            className="absolute left-2 top-3 h-0.5 bg-[#167A4A] z-0 transition-all duration-300"
            style={{ width: `${(currentStageIndex / (lifecycleStages.length - 1)) * 95}%` }}
          />

          {lifecycleStages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#167A4A] text-white'
                      : isCurrent
                      ? 'bg-white border-2 border-[#167A4A] text-[#167A4A] ring-4 ring-[#E8F4ED]'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-1.5 whitespace-nowrap ${
                    isCurrent
                      ? 'font-bold text-[#167A4A]'
                      : isCompleted
                      ? 'font-medium text-stone-700'
                      : 'text-stone-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button (Contextual for Teacher or Student) */}
      {role === 'school' && (
        <button
          type="button"
          onClick={() => {
            setAssignTargetHotspot(currentHotspot);
            setIsAssignModalOpen(true);
          }}
          className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-[#12633C] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Assign This Hotspot to School Club / NSS Unit</span>
        </button>
      )}

      {/* Tabs Selection (Timeline, Evidence, Details, History) */}
      <div className="flex border-b border-stone-200 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'timeline'
              ? 'border-[#167A4A] text-[#167A4A]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Timeline
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'evidence'
              ? 'border-[#167A4A] text-[#167A4A]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Evidence
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'details'
              ? 'border-[#167A4A] text-[#167A4A]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'history'
              ? 'border-[#167A4A] text-[#167A4A]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Recurrence History
        </button>
      </div>

      {/* TAB 1: TIMELINE (Section 16) */}
      {activeTab === 'timeline' && (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {currentHotspot.timeline.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#167A4A] flex items-center justify-center text-[9px] text-[#167A4A] font-bold">
                ✓
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-colors shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-stone-400">{event.timestamp}</span>
                  <span className="font-semibold text-[#167A4A] bg-[#E8F4ED] px-2 py-0.5 rounded text-[10px]">
                    {event.stage}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#17201B] mt-0.5">
                  {event.title}
                </h4>

                <p className="text-xs text-[#6B746E] leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Logged by: <strong>{event.actor}</strong></span>
                  <span className="text-[10px] text-stone-400">{event.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: EVIDENCE (Section 17) */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-stone-700 mb-1.5">
                Before Clearance
              </div>
              <EvidenceCard
                type="before"
                title="Baseline Accumulation"
                location={currentHotspot.locationName}
                coords={`${currentHotspot.coordinates.lat}° N, ${currentHotspot.coordinates.lng}° E`}
                timestamp="24 Apr · 10:42 AM"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-stone-700 mb-1.5">
                After Clearance
              </div>
              <EvidenceCard
                type="after"
                title="Post-Clean Inspection"
                location={currentHotspot.locationName}
                coords={`${currentHotspot.coordinates.lat}° N, ${currentHotspot.coordinates.lng}° E`}
                timestamp="25 Apr · 8:30 AM"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-stone-700 mb-1.5">
                Eco Club Supervised Activity
              </div>
              <EvidenceCard
                type="activity"
                title="Safe Dry Segregation"
                location={currentHotspot.locationName}
                coords={`${currentHotspot.coordinates.lat}° N, ${currentHotspot.coordinates.lng}° E`}
                actor="Green Valley Eco Club · 10 Students"
                timestamp="26 Apr · 8:00 AM"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-stone-700 mb-1.5">
                Handover Verification
              </div>
              <EvidenceCard
                type="handover"
                title="Municipal Tipper Handover"
                location={currentHotspot.locationName}
                coords={`${currentHotspot.coordinates.lat}° N, ${currentHotspot.coordinates.lng}° E`}
                actor="Ward 12 Crew Lead"
                timestamp="26 Apr · 9:45 AM"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DETAILS */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs space-y-3">
            <h3 className="font-bold text-sm text-[#17201B]">Spatial & Waste Ledger</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Persistent ID</span>
                <span className="font-mono font-bold text-sm text-[#167A4A] block mt-0.5">
                  {currentHotspot.id}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 uppercase font-mono">GPS Coordinates</span>
                <span className="font-mono text-xs font-semibold text-stone-800 block mt-0.5">
                  {currentHotspot.coordinates.lat}, {currentHotspot.coordinates.lng}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Municipal Ward</span>
                <span className="text-xs font-semibold text-stone-800 block mt-0.5">
                  {currentHotspot.ward}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Assigned Team</span>
                <span className="text-xs font-semibold text-stone-800 block mt-0.5">
                  {currentHotspot.assignedTeam || 'Pending Dispatch'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Assigned Club</span>
                <span className="text-xs font-semibold text-stone-800 block mt-0.5">
                  {currentHotspot.assignedClub || 'None'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Observation Count</span>
                <span className="font-mono font-bold text-sm text-stone-800 block mt-0.5">
                  {currentHotspot.observationCount} records merged
                </span>
              </div>
            </div>

            {/* Waste percentage breakdown */}
            {currentHotspot.wasteBreakdown && (
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="text-xs font-semibold text-stone-700 block">
                  Waste Fraction Breakdown
                </span>
                <div className="space-y-1.5">
                  {currentHotspot.wasteBreakdown.map((wb) => (
                    <div key={wb.category} className="flex items-center justify-between text-xs">
                      <span className="text-stone-600">{wb.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 sm:w-36 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#167A4A] rounded-full"
                            style={{ width: `${wb.percentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-stone-500 w-8 text-right font-medium">
                          {wb.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: RECURRENCE HISTORY (Section 29) */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
            <h3 className="font-bold text-sm text-[#17201B]">
              Continuous Physical Site History
            </h3>
            <p className="text-xs text-[#6B746E] leading-relaxed">
              In safAI, hotspots are never closed as arbitrary tickets. Sanitation integrity requires continuous longitudinal monitoring of physical land parcels.
            </p>

            <div className="space-y-2 pt-3 border-t border-stone-100">
              {currentHotspot.recurrenceHistory.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-stone-50 border border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <div className="flex items-start sm:items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-stone-400 w-16 shrink-0">
                      {log.date}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        log.status === 'Recurring'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : log.status === 'Cleaned'
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-stone-700 leading-tight">
                      {log.notes}
                    </span>
                  </div>
                  {log.clearedBy && (
                    <span className="text-[10px] text-stone-400 font-mono self-end sm:self-center">
                      Cleared by: {log.clearedBy}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
