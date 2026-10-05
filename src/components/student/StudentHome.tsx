import React from 'react';
import { Camera, Calendar, ArrowRight, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Hotspot } from '../../types';

export const StudentHome: React.FC = () => {
  const {
    userProfile,
    hotspots,
    assignedActivity,
    setIsObserveModalOpen,
    setIsActivityModalOpen,
    setSelectedHotspotId,
  } = useApp();

  const nearbyHotspots = hotspots.slice(0, 4);

  const getStatusBadge = (status: Hotspot['status'], isRecurring: boolean) => {
    if (status === 'Sustained Clean') {
      return (
        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Sustained Clean
        </span>
      );
    }
    if (isRecurring || status === 'Recurring') {
      return (
        <span className="text-[11px] font-medium text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
          Recurring
        </span>
      );
    }
    if (status === 'Assigned') {
      return (
        <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Assigned
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
        Verified
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#167A4A] text-white flex items-center justify-center font-bold text-base shadow-sm">
            AS
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#17201B]">
              Hi, {userProfile.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-[#6B746E]">
              {userProfile.schoolName} · {userProfile.grade}
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Action Card (Report an Observation) */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="max-w-md">
          <span className="text-[11px] font-semibold tracking-wider text-[#167A4A] uppercase font-mono">
            See something that needs attention?
          </span>
          <h2 className="text-xl font-bold tracking-tight text-[#17201B] mt-1">
            Report an Observation
          </h2>
          <p className="text-xs text-[#6B746E] mt-1.5 leading-relaxed">
            Capture a photo on-site. Location and time are recorded automatically. Live capture only.
          </p>

          <button
            type="button"
            onClick={() => setIsObserveModalOpen(true)}
            className="mt-4 px-4 py-2.5 rounded-xl bg-[#167A4A] text-white font-medium text-xs flex items-center gap-2 hover:bg-[#12633C] active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Observe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Your Next Activity Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#17201B]">Your next activity</h2>
          <span className="text-[11px] font-medium text-stone-500">Supervised by School</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#167A4A]/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#167A4A]">
                  {assignedActivity.hotspotId}
                </span>
                <span className="text-xs font-semibold text-[#17201B]">
                  Cleanliness & Segregation Drive
                </span>
              </div>
              <p className="text-xs text-[#6B746E] mt-1">
                {assignedActivity.date} · {assignedActivity.time}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {assignedActivity.clubName}
              </p>
            </div>

            <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {assignedActivity.status}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              Supervisor: {assignedActivity.supervisorTeacher}
            </span>
            <button
              type="button"
              onClick={() => setIsActivityModalOpen(true)}
              className="text-xs font-semibold text-[#167A4A] hover:underline flex items-center gap-1"
            >
              View activity →
            </button>
          </div>
        </div>
      </div>

      {/* Nearby Verified Hotspots Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#17201B]">Nearby verified hotspots</h2>
          <span className="text-[11px] text-[#6B746E]">Based on your school perimeter</span>
        </div>

        <div className="space-y-2">
          {nearbyHotspots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => setSelectedHotspotId(spot.id)}
              className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-[#167A4A]/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Visual Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                  <div className="text-[10px] font-mono font-bold text-stone-600">
                    {spot.id}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#167A4A]">
                      {spot.id}
                    </span>
                    <span className="text-xs font-semibold text-[#17201B] truncate">
                      {spot.locationName}
                    </span>
                  </div>

                  {/* Clean unboxed zero-pill metadata line */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B746E] mt-0.5 font-normal">
                    <span>{spot.distanceKm} km</span>
                    <span aria-hidden="true">·</span>
                    <span>{spot.primaryWaste}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        spot.severity === 'High'
                          ? 'text-red-700 font-medium'
                          : spot.severity === 'Medium'
                          ? 'text-amber-700 font-medium'
                          : 'text-stone-600'
                      }
                    >
                      {spot.severity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(spot.status, spot.isRecurring)}
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Contribution Summary (Civic & Professional, No Gaming Slop) */}
      <div className="p-4 rounded-xl bg-white border border-stone-200">
        <h3 className="text-xs font-bold text-[#17201B] uppercase tracking-wide mb-3">
          My contribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
            <span className="text-lg font-bold text-[#17201B] font-mono tabular-nums">
              {userProfile.contributions.verifiedObservations}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Verified observations
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
            <span className="text-lg font-bold text-[#17201B] font-mono tabular-nums">
              {userProfile.contributions.supervisedActivities}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Activities
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
            <span className="text-lg font-bold text-[#17201B] font-mono tabular-nums">
              {userProfile.contributions.successfulFollowUps}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Follow-ups
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
            <span className="text-lg font-bold text-[#167A4A] font-mono tabular-nums">
              {userProfile.contributions.sustainedCleanContributions}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Sustained-clean
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
