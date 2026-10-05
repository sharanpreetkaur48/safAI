import React from 'react';
import {
  User,
  ShieldCheck,
  AlertTriangle,
  Users,
  LogOut,
  Building2,
  Calendar,
  Award,
  ChevronRight,
  Info,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { userProfile, role, setIsRoleSelectorOpen, toggleOffline, isOffline, offlineQueueCount } = useApp();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Profile Identity Card */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#167A4A] text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
          {userProfile.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#17201B] truncate">
              {userProfile.name}
            </h1>
            <span className="text-[11px] font-semibold text-[#167A4A] bg-[#E8F4ED] px-2 py-0.5 rounded uppercase font-mono">
              {role}
            </span>
          </div>

          <p className="text-xs text-[#6B746E] mt-0.5">
            {role === 'student' && `${userProfile.schoolName} · ${userProfile.grade}`}
            {role === 'school' && `${userProfile.schoolName} · Head of Eco Club`}
            {role === 'municipality' && `${userProfile.department} · ${userProfile.zone}`}
          </p>
        </div>
      </div>

      {/* Role-Specific Metric Summary */}
      {role === 'student' && (
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
          <h2 className="text-xs font-bold text-[#17201B] uppercase tracking-wider">
            Verified Civic Contributions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
              <span className="font-mono font-bold text-base text-[#17201B] block">
                {userProfile.contributions.verifiedObservations}
              </span>
              <span className="text-[11px] text-stone-500">Observations</span>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
              <span className="font-mono font-bold text-base text-[#17201B] block">
                {userProfile.contributions.supervisedActivities}
              </span>
              <span className="text-[11px] text-stone-500">Activities</span>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
              <span className="font-mono font-bold text-base text-[#17201B] block">
                {userProfile.contributions.successfulFollowUps}
              </span>
              <span className="text-[11px] text-stone-500">Follow-ups</span>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
              <span className="font-mono font-bold text-base text-[#167A4A] block">
                {userProfile.contributions.sustainedCleanContributions}
              </span>
              <span className="text-[11px] text-stone-500">Sustained Clean</span>
            </div>
          </div>

          {/* Section 36: Impact Score Policy */}
          <div className="p-3 rounded-lg bg-stone-50 text-[11px] text-[#6B746E] leading-relaxed border border-stone-100">
            <strong>Impact Assessment Policy:</strong> Observations count toward hotspot confirmation, but long-term sustained-clean stewardship carries highest weighting. We reject competitive report gaming.
          </div>
        </div>
      )}

      {/* Safety Policy Directive */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#17201B]">
          <ShieldCheck className="w-4 h-4 text-[#167A4A]" />
          <span>Institutional Safety Guardrails</span>
        </div>
        <p className="text-xs text-[#6B746E] leading-relaxed">
          Students are only permitted to conduct supervised observation and safe dry recyclable sorting under a designated teacher. Contact with hazardous or sanitary waste, chemical solvents, or confrontation with public offenders is strictly prohibited.
        </p>
      </div>

      {/* Offline sync & Connection settings */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#17201B] block">
            Field Offline Mode
          </span>
          <span className="text-[11px] text-stone-500">
            {isOffline
              ? `Offline active (${offlineQueueCount} queued records will auto-sync)`
              : 'Connected to Municipal Urban Registry'}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleOffline}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isOffline
              ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
          }`}
        >
          {isOffline ? 'Go Online' : 'Simulate Offline'}
        </button>
      </div>

      {/* Role Switcher Action */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
        <span className="text-xs font-semibold text-[#17201B] block">
          Perspective / Persona Switcher
        </span>
        <p className="text-xs text-stone-500">
          Seamlessly switch between Student, School Coordinator, and Municipal Sanitation views to evaluate all end-to-end flows.
        </p>
        <button
          type="button"
          onClick={() => setIsRoleSelectorOpen(true)}
          className="mt-2 w-full h-10 rounded-xl bg-[#E8F4ED] border border-[#167A4A]/30 text-[#167A4A] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#d6ecdf] transition-colors"
        >
          <Users className="w-4 h-4" />
          <span>Switch User Role & Flow</span>
        </button>
      </div>
    </div>
  );
};
