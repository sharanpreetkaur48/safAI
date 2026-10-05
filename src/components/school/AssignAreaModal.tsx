import React, { useState } from 'react';
import { X, Calendar, Clock, User, AlertOctagon, CheckCircle2, ShieldCheck, MapPin, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Hotspot } from '../../types';

export const AssignAreaModal: React.FC = () => {
  const {
    isAssignModalOpen,
    setIsAssignModalOpen,
    assignTargetHotspot,
    clubs,
    assignHotspotToClub,
    setSelectedHotspotId,
  } = useApp();

  const [selectedClub, setSelectedClub] = useState('Green Valley Eco Club');
  const [studentMode, setStudentMode] = useState<'group' | 'custom'>('group');
  const [studentCount, setStudentCount] = useState(10);
  const [supervisor, setSupervisor] = useState('Dr. Meera Singh');
  const [activityDate, setActivityDate] = useState('26 Apr 2025');
  const [activityTime, setActivityTime] = useState('8:00 AM');

  // Permitted tasks
  const [permittedTasks, setPermittedTasks] = useState<string[]>([
    'Awareness campaign with neighborhood shopkeepers',
    'Safe segregation of dry paper & plastic packaging',
    'Site observation & baseline perimeter photography',
    'Evidence collection & municipal handover log',
  ]);

  const [isAssignedSuccess, setIsAssignedSuccess] = useState(false);

  if (!isAssignModalOpen || !assignTargetHotspot) return null;

  const handleToggleTask = (task: string) => {
    if (permittedTasks.includes(task)) {
      setPermittedTasks(permittedTasks.filter((t) => t !== task));
    } else {
      setPermittedTasks([...permittedTasks, task]);
    }
  };

  const handleConfirmAssignment = () => {
    assignHotspotToClub(
      assignTargetHotspot.id,
      selectedClub,
      supervisor,
      activityDate,
      activityTime,
      studentCount,
      permittedTasks
    );
    setIsAssignedSuccess(true);
  };

  const handleClose = () => {
    setIsAssignModalOpen(false);
    setIsAssignedSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#F7F8F6] rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white shrink-0">
          <div>
            <div className="text-[11px] font-mono font-semibold text-[#167A4A] uppercase">
              Supervised Field Assignment
            </div>
            <h2 className="text-base font-bold text-[#17201B]">
              Assign a hotspot to your group
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isAssignedSuccess ? (
            <div className="p-6 rounded-xl bg-[#E8F4ED] border border-[#167A4A]/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#167A4A] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17201B]">Area Assigned!</h3>
              <div className="p-3 bg-white rounded-lg border border-[#167A4A]/20 text-xs text-left text-stone-700 space-y-1">
                <p>
                  <strong>{assignTargetHotspot.id}</strong> has been assigned to:
                </p>
                <p className="font-semibold text-[#167A4A]">{selectedClub}</p>
                <p>{studentCount} students participating</p>
                <p>Supervisor: {supervisor}</p>
                <p>Activity: {activityDate} · {activityTime}</p>
              </div>
              <p className="text-xs text-stone-600">
                This activity now appears immediately on participating students' home screens.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setSelectedHotspotId(assignTargetHotspot.id);
                }}
                className="mt-2 px-4 py-2 rounded-lg bg-[#167A4A] text-white text-xs font-semibold hover:bg-[#12633C] transition-colors"
              >
                View Hotspot Detail
              </button>
            </div>
          ) : (
            <>
              {/* Target Hotspot Context Card */}
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#17201B]">
                    <span className="font-mono text-[#167A4A]">{assignTargetHotspot.id}</span>
                    <span>·</span>
                    <span>{assignTargetHotspot.locationName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {assignTargetHotspot.distanceKm} km
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 text-[11px]">
                  <span>Waste: {assignTargetHotspot.primaryWaste}</span>
                  <span>·</span>
                  <span className="text-red-700 font-medium">Severity: {assignTargetHotspot.severity}</span>
                  <span>·</span>
                  <span>Status: {assignTargetHotspot.status}</span>
                </div>
              </div>

              {/* Assign to Club Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1">
                  Assign to Club / Unit
                </label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.memberCount} members)
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Count / Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1">
                  Assign Students
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('group');
                      setStudentCount(10);
                    }}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                      studentMode === 'group'
                        ? 'border-[#167A4A] bg-[#E8F4ED] text-[#167A4A] font-semibold'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    Group Cohort (10 students)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('custom');
                      setStudentCount(24);
                    }}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                      studentMode === 'custom'
                        ? 'border-[#167A4A] bg-[#E8F4ED] text-[#167A4A] font-semibold'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    Full Club Squad (24 students)
                  </button>
                </div>
              </div>

              {/* Supervising Teacher */}
              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1">
                  Supervising Teacher
                </label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17201B] mb-1">
                    Activity Date
                  </label>
                  <input
                    type="text"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17201B] mb-1">
                    Activity Time
                  </label>
                  <input
                    type="text"
                    value={activityTime}
                    onChange={(e) => setActivityTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-white text-xs text-[#17201B] focus:border-[#167A4A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Permitted Activities Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1.5">
                  Permitted Supervised Activities
                </label>
                <div className="space-y-1.5">
                  {[
                    'Awareness campaign with neighborhood shopkeepers',
                    'Safe segregation of dry paper & plastic packaging',
                    'Site observation & baseline perimeter photography',
                    'Evidence collection & municipal handover log',
                  ].map((task) => {
                    const isChecked = permittedTasks.includes(task);
                    return (
                      <button
                        key={task}
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center gap-2 transition-all ${
                          isChecked
                            ? 'bg-[#E8F4ED]/50 border-[#167A4A]/30 text-stone-800'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-[#167A4A] border-[#167A4A] text-white'
                              : 'bg-white border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{task}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strict Institutional Safety Guardrail */}
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
                <div className="flex items-start gap-1.5 font-bold">
                  <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Mandatory Safety Policy</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-800">
                  Students must not handle hazardous, medical or sanitary waste. Unsafe material must be referred to municipal staff. Confrontation or entering hazardous drain flows is strictly forbidden.
                </p>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#12633C] transition-colors shadow-sm"
              >
                <span>Assign Area</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
