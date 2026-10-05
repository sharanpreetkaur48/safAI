import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  RotateCcw,
  ArrowRight,
  Filter,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Hotspot, SeverityLevel } from '../../types';

export const MunicipalDashboard: React.FC = () => {
  const {
    hotspots,
    setSelectedHotspotId,
    municipalVerifyHotspot,
    municipalAssignTeam,
    municipalRecordCleaning,
    municipalFollowUp,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'worklist' | 'recurrence'>('overview');
  const [selectedHotspotForAction, setSelectedHotspotForAction] = useState<Hotspot | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'assign' | 'clean' | 'followup' | null>(null);

  // Form states
  const [priorityInput, setPriorityInput] = useState<SeverityLevel>('High');
  const [teamInput, setTeamInput] = useState('Ward 12 Sanitation Team');
  const [cleaningNotes, setCleaningNotes] = useState('Primary mechanical clearance and perimeter washing completed.');
  const [followUpStatus, setFollowUpStatus] = useState<'Sustained Clean' | 'Needs Follow-up' | 'Recurring'>('Sustained Clean');
  const [followUpNotes, setFollowUpNotes] = useState('Location inspected after 7 days. Zero waste overflow observed.');

  const pendingVerificationCount = 12;
  const priorityHotspotsCount = hotspots.filter((h) => h.severity === 'High').length;
  const recurringHotspotsCount = hotspots.filter((h) => h.isRecurring).length;
  const assignedWorkCount = hotspots.filter((h) => h.status === 'Assigned').length;
  const followUpsDueCount = 8;

  const handleExecuteAction = () => {
    if (!selectedHotspotForAction) return;

    if (actionType === 'verify') {
      municipalVerifyHotspot(selectedHotspotForAction.id, priorityInput);
    } else if (actionType === 'assign') {
      municipalAssignTeam(selectedHotspotForAction.id, teamInput);
    } else if (actionType === 'clean') {
      municipalRecordCleaning(selectedHotspotForAction.id, cleaningNotes);
    } else if (actionType === 'followup') {
      municipalFollowUp(selectedHotspotForAction.id, followUpStatus, followUpNotes);
    }

    setActionType(null);
    setSelectedHotspotForAction(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Workflow Navigation Segment Bar */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl max-w-sm">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-[#17201B] shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('worklist')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'worklist'
              ? 'bg-white text-[#17201B] shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Hotspot Worklist
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recurrence')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'recurrence'
              ? 'bg-white text-[#17201B] shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Recurrence Tracker
        </button>
      </div>

      {/* Primary Municipal Strategic Header */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#167A4A] font-semibold">
            Ward 12 Sanitation Command · Municipal Field Registry
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17201B] mt-1">
            What needs action and what keeps coming back?
          </h1>
          <p className="text-xs text-[#6B746E] mt-1 leading-relaxed">
            One physical hotspot · One continuous history. Track verified clusters through cleaning, handover, and multi-week recurrence.
          </p>
        </div>

        {/* Operational Workflow Ribbon */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-[11px] font-semibold text-stone-600 overflow-x-auto gap-2">
          <span className="text-[#167A4A] font-bold">VERIFY</span>
          <span>→</span>
          <span className="text-stone-800">PRIORITISE</span>
          <span>→</span>
          <span className="text-stone-800">ASSIGN</span>
          <span>→</span>
          <span className="text-stone-800">CLEAN</span>
          <span>→</span>
          <span className="text-stone-800">RECORD</span>
          <span>→</span>
          <span className="text-[#167A4A] font-bold">FOLLOW UP</span>
        </div>

        {/* Core Operational Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-lg font-bold font-mono text-[#17201B] tabular-nums">
              {pendingVerificationCount}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Pending verification
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-lg font-bold font-mono text-red-700 tabular-nums">
              {priorityHotspotsCount}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Priority hotspots
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-lg font-bold font-mono text-amber-800 tabular-nums">
              {recurringHotspotsCount}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Recurring hotspots
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-lg font-bold font-mono text-stone-800 tabular-nums">
              {assignedWorkCount}
            </span>
            <span className="text-[11px] text-[#6B746E] block mt-0.5">
              Assigned work
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#E8F4ED] border border-[#167A4A]/20">
            <span className="text-lg font-bold font-mono text-[#167A4A] tabular-nums">
              {followUpsDueCount}
            </span>
            <span className="text-[11px] text-[#167A4A] font-medium block mt-0.5">
              Follow-ups due
            </span>
          </div>
        </div>
      </div>

      {/* OVERVIEW / RAPID ACTIONS */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#17201B]">
              Critical Action Queue (Ward 12 & Adjacent)
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab('worklist')}
              className="text-xs font-semibold text-[#167A4A] hover:underline"
            >
              Full Worklist →
            </button>
          </div>

          <div className="space-y-2.5">
            {hotspots.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#167A4A]">{h.id}</span>
                    <span className="text-xs font-bold text-[#17201B]">{h.locationName}</span>
                    {h.isRecurring && (
                      <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        Recurring ({h.recurrenceCount}x)
                      </span>
                    )}
                  </div>
                  {/* Clean unboxed zero-pill metadata line */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B746E] mt-1 font-normal">
                    <span>Ward {h.ward}</span>
                    <span aria-hidden="true">·</span>
                    <span>{h.primaryWaste}</span>
                    <span aria-hidden="true">·</span>
                    <span className={h.severity === 'High' ? 'text-red-700 font-semibold' : 'text-stone-600'}>
                      {h.severity} Priority
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Status: {h.status}</span>
                  </div>
                </div>

                {/* Municipal Direct Operational Controls */}
                <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotspotForAction(h);
                      setActionType('assign');
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs text-stone-700 font-medium"
                  >
                    Assign Team
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotspotForAction(h);
                      setActionType('clean');
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs text-stone-700 font-medium"
                  >
                    Record Clean
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotspotForAction(h);
                      setActionType('followup');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#167A4A] text-white hover:bg-[#12633C] text-xs font-medium"
                  >
                    Follow-up
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedHotspotId(h.id)}
                    className="p-1.5 text-stone-400 hover:text-stone-700"
                    title="View Continuous History"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKLIST TAB (Table matching Section 32) */}
      {activeTab === 'worklist' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#17201B]">
              Municipal Hotspot Worklist
            </h2>
            <span className="text-[11px] text-stone-500 font-mono">
              {hotspots.length} ACTIVE RECORDS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Hotspot</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Recurrence</th>
                  <th className="py-3 px-4">Assigned Team</th>
                  <th className="py-3 px-4">Last Update</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {hotspots.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#167A4A]">
                      {row.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#17201B]">
                      {row.locationName}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {row.status}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={row.severity === 'High' ? 'text-red-700 font-bold' : 'text-stone-700'}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {row.isRecurring ? (
                        <span className="text-red-700">Yes ({row.recurrenceCount}x)</span>
                      ) : (
                        <span className="text-stone-500">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {row.assignedTeam || 'Pending'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                      {row.lastUpdated}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedHotspotId(row.id)}
                        className="text-xs font-semibold text-[#167A4A] hover:underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECURRENCE TRACKER (Demonstrating continuous history & anti-ticket-closed philosophy) */}
      {activeTab === 'recurrence' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong className="block font-semibold mb-0.5">Continuous Site History vs Ticket Closing</strong>
            safAI never closes or deletes a hotspot upon cleaning. When waste returns at the same GPS coordinate, the hotspot is flagged as Recurring to track municipal root causes (e.g. market timing, lack of bins, vendor dumping).
          </div>

          <div className="space-y-3">
            {hotspots
              .filter((h) => h.recurrenceHistory.length > 0)
              .map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#167A4A] mr-2">
                        {h.id}
                      </span>
                      <span className="text-xs font-bold text-[#17201B]">
                        {h.locationName}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500">
                      {h.recurrenceHistory.length} logged recurrence intervals
                    </span>
                  </div>

                  {/* Horizontal visual recurrence bar */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    {h.recurrenceHistory.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 border border-stone-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-stone-400 w-16">
                            {rec.date}
                          </span>
                          <span
                            className={`font-semibold text-[11px] ${
                              rec.status === 'Recurring'
                                ? 'text-red-700'
                                : rec.status === 'Cleaned'
                                ? 'text-stone-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {rec.status}
                          </span>
                          <span className="text-[11px] text-stone-600 truncate max-w-xs sm:max-w-md">
                            — {rec.notes}
                          </span>
                        </div>
                        {rec.clearedBy && (
                          <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                            {rec.clearedBy}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL: MUNICIPAL ACTION POPUP */}
      {actionType && selectedHotspotForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#F7F8F6] rounded-2xl border border-stone-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-[#17201B]">
                {actionType === 'verify' && `Verify Location · ${selectedHotspotForAction.id}`}
                {actionType === 'assign' && `Assign Sanitation Team · ${selectedHotspotForAction.id}`}
                {actionType === 'clean' && `Record Cleaning Operations · ${selectedHotspotForAction.id}`}
                {actionType === 'followup' && `Perform Recurrence Follow-up · ${selectedHotspotForAction.id}`}
              </h3>
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            {/* ACTION 1: VERIFY */}
            {actionType === 'verify' && (
              <div className="space-y-3">
                <p className="text-xs text-[#6B746E]">
                  Confirm site observation coordinates and set municipal response priority.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Assign Severity Priority
                  </label>
                  <select
                    value={priorityInput}
                    onChange={(e) => setPriorityInput(e.target.value as SeverityLevel)}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B]"
                  >
                    <option value="High">High (Immediate intervention)</option>
                    <option value="Medium">Medium (Routine pickup cycle)</option>
                    <option value="Low">Low (Perimeter maintenance)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ACTION 2: ASSIGN */}
            {actionType === 'assign' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sanitation Work Unit
                  </label>
                  <select
                    value={teamInput}
                    onChange={(e) => setTeamInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B]"
                  >
                    <option value="Ward 12 Sanitation Team">Ward 12 Sanitation Team</option>
                    <option value="Ward 8 Team">Ward 8 Team</option>
                    <option value="Ward 14 Heavy Rubble Crew">Ward 14 Heavy Rubble Crew</option>
                    <option value="Central Night Dispatch">Central Night Dispatch</option>
                  </select>
                </div>
              </div>
            )}

            {/* ACTION 3: CLEAN */}
            {actionType === 'clean' && (
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  Documentary evidence: Before & After clearance photos logged to persistent hotspot registry.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cleaning Execution Log
                  </label>
                  <textarea
                    rows={3}
                    value={cleaningNotes}
                    onChange={(e) => setCleaningNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B]"
                  />
                </div>
              </div>
            )}

            {/* ACTION 4: FOLLOW-UP */}
            {actionType === 'followup' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Follow-up Audit Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Sustained Clean', 'Needs Follow-up', 'Recurring'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFollowUpStatus(st)}
                        className={`p-2 rounded-lg border text-xs font-medium text-center ${
                          followUpStatus === st
                            ? 'border-[#167A4A] bg-[#E8F4ED] text-[#167A4A] font-bold'
                            : 'border-stone-200 bg-white text-stone-600'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Inspection Findings
                  </label>
                  <textarea
                    rows={2}
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-white text-xs text-[#17201B]"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleExecuteAction}
              className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-[#12633C] transition-colors"
            >
              <span>Confirm Action</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
