import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Truck,
  Scale,
  Camera,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EvidenceCard } from '../common/EvidenceCard';

export const ActivityChecklistModal: React.FC = () => {
  const {
    isActivityModalOpen,
    setIsActivityModalOpen,
    assignedActivity,
    completeActivityChecklist,
    submitSegregationHandover,
    setSelectedHotspotId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'checklist' | 'segregation'>('checklist');
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    assignedActivity.checklist.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.completed }), {})
  );

  // Segregation form
  const [dryKg, setDryKg] = useState(72);
  const [wetKg, setWetKg] = useState(28);
  const [sanitaryKg, setSanitaryKg] = useState(12);
  const [otherKg, setOtherKg] = useState(8);
  const [handoverVehicle, setHandoverVehicle] = useState('Municipal Collection Tipper #DL-12-8841');
  const [handoverSubmitted, setHandoverSubmitted] = useState(false);

  if (!isActivityModalOpen) return null;

  const totalKg = dryKg + wetKg + sanitaryKg + otherKg;
  const completedCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = assignedActivity.checklist.length;

  const toggleCheck = (id: string) => {
    const updated = { ...checklistState, [id]: !checklistState[id] };
    setChecklistState(updated);
    const completedIds = Object.keys(updated).filter((k) => updated[k]);
    completeActivityChecklist(completedIds);
  };

  const handleHandoverSubmit = () => {
    submitSegregationHandover({
      totalKg,
      dryKg,
      wetKg,
      sanitaryKg,
      otherKg,
      channel: handoverVehicle,
    });
    setHandoverSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#F7F8F6] rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white shrink-0">
          <div>
            <div className="text-[11px] font-mono font-semibold text-[#167A4A] uppercase">
              {assignedActivity.hotspotId} · Supervised Activity
            </div>
            <h2 className="text-base font-bold text-[#17201B]">
              Cleanliness & Segregation Drive
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsActivityModalOpen(false)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Checklist and Handover */}
        <div className="px-5 pt-3 pb-0 bg-white border-b border-stone-200 flex gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'checklist'
                ? 'border-[#167A4A] text-[#167A4A]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Activity Checklist ({completedCount}/{totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('segregation')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'segregation'
                ? 'border-[#167A4A] text-[#167A4A]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Segregation & Handover
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metadata Ledger */}
          <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-stone-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#167A4A]" />
                {assignedActivity.date} · {assignedActivity.time}
              </span>
              <span className="flex items-center gap-1 font-medium text-[#17201B]">
                <User className="w-3.5 h-3.5 text-stone-400" />
                Supervisor: {assignedActivity.supervisorTeacher}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
              Location: {assignedActivity.hotspotLocation} ({assignedActivity.hotspotName})
            </div>
          </div>

          {activeTab === 'checklist' && (
            <>
              {/* Safety Rules Accordion: Do vs Do Not */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#E8F4ED]/60 border border-[#167A4A]/20 text-xs">
                  <div className="font-bold text-[#167A4A] flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>What you can do</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-700 text-[11px]">
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#167A4A]">✓</span> Observe & document site boundary
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#167A4A]">✓</span> Help with safe dry segregation
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#167A4A]">✓</span> Take clear photo evidence
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#167A4A]">✓</span> Record municipal vehicle handover
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 text-xs">
                  <div className="font-bold text-red-800 flex items-center gap-1.5 mb-2">
                    <AlertOctagon className="w-4 h-4 text-red-600" />
                    <span>What you must not do</span>
                  </div>
                  <ul className="space-y-1.5 text-red-950 text-[11px]">
                    <li className="flex items-center gap-1.5">
                      <span className="text-red-600 font-bold">✕</span> Handle hazardous or chemical waste
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-red-600 font-bold">✕</span> Handle medical or sanitary waste
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-red-600 font-bold">✕</span> Confront anyone or vendors
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-red-600 font-bold">✕</span> Enter steep canal banks or unsafe zones
                    </li>
                  </ul>
                </div>
              </div>

              {/* Interactive Checklist Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#17201B]">
                  <span>Activity Step-by-Step</span>
                  <span className="text-stone-500 font-normal">
                    {completedCount} of {totalCount} completed
                  </span>
                </div>

                <div className="space-y-2">
                  {assignedActivity.checklist.map((item) => {
                    const isDone = checklistState[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleCheck(item.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isDone
                            ? 'bg-[#E8F4ED]/40 border-[#167A4A]/30 text-stone-800'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                            isDone
                              ? 'bg-[#167A4A] border-[#167A4A] text-white'
                              : 'bg-white border-stone-300 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className={`text-xs font-medium ${isDone ? 'line-through text-stone-500' : ''}`}>
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evidence preview card */}
              <div>
                <div className="text-xs font-semibold text-[#17201B] mb-1.5">
                  Supervised Drive Evidence
                </div>
                <EvidenceCard
                  type="activity"
                  title="Eco Club Safe Segregation Drive"
                  actor="Green Valley Eco Club · 10 Students"
                  timestamp="26 Apr · 8:30 AM"
                  variant="gallery"
                />
              </div>

              {/* Progress CTA */}
              <button
                type="button"
                onClick={() => setActiveTab('segregation')}
                className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#12633C] transition-colors"
              >
                <span>Proceed to Handover & Weighing Record</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {activeTab === 'segregation' && (
            <div className="space-y-4">
              {handoverSubmitted ? (
                <div className="p-6 rounded-xl bg-[#E8F4ED] border border-[#167A4A]/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#167A4A] text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#17201B]">
                    Segregation & Handover Verified!
                  </h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    120 kg waste successfully logged and handed over to Municipal Collection Tipper #DL-12-8841. Hotspot H-014 timeline updated.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsActivityModalOpen(false);
                      setSelectedHotspotId('H-014');
                    }}
                    className="mt-2 px-4 py-2 rounded-lg bg-[#167A4A] text-white text-xs font-medium hover:bg-[#12633C] transition-colors"
                  >
                    View Updated H-014 Timeline
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#17201B]">
                      <span className="flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-[#167A4A]" />
                        Waste Segregation Weights
                      </span>
                      <span className="font-mono text-sm text-[#167A4A] font-bold">
                        {totalKg} kg total
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-stone-500 text-[11px] block">Dry / Recyclable</span>
                        <div className="flex items-center justify-between mt-1">
                          <input
                            type="number"
                            value={dryKg}
                            onChange={(e) => setDryKg(Number(e.target.value))}
                            className="w-16 font-mono font-semibold bg-white border border-stone-300 rounded px-1.5 py-0.5 text-xs"
                          />
                          <span className="text-stone-500 font-mono text-[11px]">kg</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-stone-500 text-[11px] block">Wet / Organic</span>
                        <div className="flex items-center justify-between mt-1">
                          <input
                            type="number"
                            value={wetKg}
                            onChange={(e) => setWetKg(Number(e.target.value))}
                            className="w-16 font-mono font-semibold bg-white border border-stone-300 rounded px-1.5 py-0.5 text-xs"
                          />
                          <span className="text-stone-500 font-mono text-[11px]">kg</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-stone-500 text-[11px] block">Sanitary (Handled by Staff)</span>
                        <div className="flex items-center justify-between mt-1">
                          <input
                            type="number"
                            value={sanitaryKg}
                            onChange={(e) => setSanitaryKg(Number(e.target.value))}
                            className="w-16 font-mono font-semibold bg-white border border-stone-300 rounded px-1.5 py-0.5 text-xs"
                          />
                          <span className="text-stone-500 font-mono text-[11px]">kg</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="text-stone-500 text-[11px] block">Other / Inert</span>
                        <div className="flex items-center justify-between mt-1">
                          <input
                            type="number"
                            value={otherKg}
                            onChange={(e) => setOtherKg(Number(e.target.value))}
                            className="w-16 font-mono font-semibold bg-white border border-stone-300 rounded px-1.5 py-0.5 text-xs"
                          />
                          <span className="text-stone-500 font-mono text-[11px]">kg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Handover Details */}
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-3 text-xs">
                    <div className="font-semibold text-[#17201B] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#167A4A]" />
                      <span>Municipal Handover Log</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block mb-1">
                        Handover Channel / Collection Vehicle
                      </label>
                      <input
                        type="text"
                        value={handoverVehicle}
                        onChange={(e) => setHandoverVehicle(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-stone-200 text-xs bg-white focus:border-[#167A4A] focus:outline-none"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                      Handover note: Students do not dispose of sanitary or chemical residues. Hazardous fractions transferred under physical supervisor sign-off.
                    </div>
                  </div>

                  {/* Handover Evidence Card */}
                  <div>
                    <div className="text-xs font-semibold text-[#17201B] mb-1.5">
                      Vehicle Handover Evidence Photo
                    </div>
                    <EvidenceCard
                      type="handover"
                      title="Municipal Vehicle Handover Verification"
                      actor="Ward 12 Crew & Dr. Meera Singh"
                      timestamp="26 Apr · 9:45 AM"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleHandoverSubmit}
                    className="w-full h-11 rounded-xl bg-[#167A4A] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#12633C] transition-colors"
                  >
                    <span>Submit & Verify Activity Record</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
