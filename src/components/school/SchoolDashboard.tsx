import React, { useState } from 'react';
import {
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Plus,
  Shield,
  Search,
  Filter,
  BarChart2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Hotspot, EcoClub, ParticipatingSchool } from '../../types';

export const SchoolDashboard: React.FC = () => {
  const {
    clubs,
    schools,
    hotspots,
    setIsAssignModalOpen,
    setAssignTargetHotspot,
    setSelectedHotspotId,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'clubs' | 'participating' | 'leaderboard'>('overview');
  const [schoolFilter, setSchoolFilter] = useState<'all' | 'top' | 'government' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const assignedHotspots = hotspots.filter((h) => h.status === 'Assigned' || h.assignedClub);
  const candidateHotspots = hotspots.filter((h) => h.status === 'Verified' || h.status === 'Recurring');

  const filteredSchools = schools
    .filter((s) => {
      if (schoolFilter === 'top') return s.rank <= 2;
      if (schoolFilter === 'government') return s.type === 'Government';
      if (schoolFilter === 'private') return s.type === 'Private';
      return true;
    })
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.city.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenAssignModal = (hotspot: Hotspot) => {
    setAssignTargetHotspot(hotspot);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Sub-Navigation Segments */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl max-w-md overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-white text-[#17201B] shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('clubs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'clubs'
              ? 'bg-white text-[#17201B] shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Eco Clubs & Units
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('participating')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'participating'
              ? 'bg-white text-[#17201B] shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Participating Schools
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('leaderboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'leaderboard'
              ? 'bg-white text-[#17201B] shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Impact Ranking
        </button>
      </div>

      {/* OVERVIEW SUB-TAB */}
      {activeSubTab === 'overview' && (
        <>
          {/* Main Strategic Question Banner */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#167A4A] font-semibold">
              Green Valley High School · School Coordinator
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17201B]">
              Where can our school contribute meaningfully?
            </h1>
            <p className="text-xs text-[#6B746E] max-w-xl leading-relaxed">
              View verified municipal hotspots, coordinate student clubs, and assign supervised safe segregation and awareness drives.
            </p>

            {/* Operational Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-xl font-bold font-mono text-[#17201B]">3</span>
                <span className="text-xs text-[#6B746E] block mt-0.5">Eco Clubs</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-xl font-bold font-mono text-[#17201B]">142</span>
                <span className="text-xs text-[#6B746E] block mt-0.5">Enrolled Students</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-xl font-bold font-mono text-[#17201B]">12</span>
                <span className="text-xs text-[#6B746E] block mt-0.5">Activities This Month</span>
              </div>
              <div className="p-3 rounded-xl bg-[#E8F4ED] border border-[#167A4A]/20">
                <span className="text-xl font-bold font-mono text-[#167A4A]">4</span>
                <span className="text-xs text-[#167A4A] font-medium block mt-0.5">Assigned Hotspots</span>
              </div>
            </div>
          </div>

          {/* Hotspots Ready for Assignment (FLOW B STEP) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#17201B]">
                  Verified Hotspots Awaiting School Partnership
                </h2>
                <p className="text-xs text-[#6B746E]">
                  Locations verified by municipal teams eligible for supervised drives
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {candidateHotspots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-4 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#167A4A]/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#167A4A]">{spot.id}</span>
                      <span className="text-xs font-bold text-[#17201B]">{spot.name}</span>
                      {spot.isRecurring && (
                        <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                          Recurring
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {spot.landmark} · {spot.distanceKm} km away · Ward {spot.ward}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-600">
                      <span>Primary: {spot.primaryWaste}</span>
                      <span>·</span>
                      <span className="text-red-700 font-medium">Severity: {spot.severity}</span>
                      <span>·</span>
                      <span>{spot.observationCount} observations</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedHotspotId(spot.id)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      History
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(spot)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#167A4A] text-white text-xs font-semibold hover:bg-[#12633C] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign Area</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CLUBS SUB-TAB */}
      {activeSubTab === 'clubs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#17201B]">Active Clubs & Groups</h2>
            <span className="text-xs text-stone-500">3 Registered Institutional Units</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-[#17201B]">{club.name}</h3>
                  <div className="text-xs text-stone-500 mt-1">
                    Coordinator: {club.coordinatorTeacher}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <span className="font-mono font-bold text-sm text-[#17201B] block">
                        {club.memberCount}
                      </span>
                      <span className="text-[10px] text-stone-500">Students</span>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <span className="font-mono font-bold text-sm text-[#167A4A] block">
                        {club.activitiesCompleted}
                      </span>
                      <span className="text-[10px] text-stone-500">Drives</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    {club.activeHotspotIds.length} active areas
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const spot = candidateHotspots[0] || hotspots[0];
                      handleOpenAssignModal(spot);
                    }}
                    className="text-xs font-semibold text-[#167A4A] hover:underline"
                  >
                    Assign hotspot →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTICIPATING SCHOOLS SUB-TAB */}
      {activeSubTab === 'participating' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#17201B]">Participating Schools</h2>
              <p className="text-xs text-[#6B746E]">
                Civic sanitation coordination network across municipal wards
              </p>
            </div>

            {/* Filter chips (functional buttons) */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setSchoolFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  schoolFilter === 'all' ? 'bg-white font-semibold text-stone-900 shadow-sm' : 'text-stone-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSchoolFilter('top')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  schoolFilter === 'top' ? 'bg-white font-semibold text-stone-900 shadow-sm' : 'text-stone-600'
                }`}
              >
                Top performing
              </button>
              <button
                type="button"
                onClick={() => setSchoolFilter('government')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  schoolFilter === 'government' ? 'bg-white font-semibold text-stone-900 shadow-sm' : 'text-stone-600'
                }`}
              >
                Government
              </button>
              <button
                type="button"
                onClick={() => setSchoolFilter('private')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  schoolFilter === 'private' ? 'bg-white font-semibold text-stone-900 shadow-sm' : 'text-stone-600'
                }`}
              >
                Private
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search school name, zone or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
            />
          </div>

          {/* School cards list */}
          <div className="space-y-2.5">
            {filteredSchools.map((sch) => (
              <div
                key={sch.id}
                className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-3 shadow-sm hover:border-[#167A4A]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F4ED] text-[#167A4A] font-bold text-sm flex items-center justify-center font-mono">
                    #{sch.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#17201B]">{sch.name}</span>
                      <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        {sch.type}
                      </span>
                    </div>
                    {/* Unboxed clean metadata line */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6B746E] mt-0.5">
                      <span>{sch.clubCount} Eco Clubs</span>
                      <span aria-hidden="true">·</span>
                      <span>{sch.studentCount} students</span>
                      <span aria-hidden="true">·</span>
                      <span>{sch.city}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold font-mono text-[#167A4A] tabular-nums">
                    {sch.verifiedContributions}
                  </div>
                  <div className="text-[10px] text-stone-500">verified actions</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEADERBOARD SUB-TAB (Civic & Responsible Impact Ranking) */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-900 block mb-0.5">Civil Impact Assessment Policy</strong>
            safAI measures verified observations, supervised activities, successful follow-ups, and sustained-clean hotspots. We never reward raw complaint volume or unsupervised student cleanups.
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17201B]">
                School Performance · This Month
              </span>
              <span className="text-[11px] text-[#6B746E]">Ward 12 & Central Zone</span>
            </div>

            <div className="divide-y divide-stone-100">
              {schools.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono text-xs font-bold text-stone-500">
                      {item.rank}
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-[#17201B]">{item.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {item.clubCount} Clubs · {item.studentCount} active students
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-[#167A4A] tabular-nums">
                      {item.verifiedContributions} verified contributions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
