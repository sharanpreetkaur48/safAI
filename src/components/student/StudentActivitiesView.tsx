import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentActivitiesView: React.FC = () => {
  const { assignedActivity, setIsActivityModalOpen, setSelectedHotspotId } = useApp();

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#17201B]">Supervised Activities</h1>
          <p className="text-xs text-[#6B746E]">
            Educational field sanitation & segregation drives
          </p>
        </div>
      </div>

      {/* Active Assignment Card */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#167A4A]">
                {assignedActivity.hotspotId}
              </span>
              <span className="text-xs font-bold text-[#17201B]">
                Cleanliness & Segregation Drive
              </span>
            </div>
            <p className="text-xs text-[#6B746E] mt-1">
              {assignedActivity.hotspotLocation}
            </p>
          </div>
          <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {assignedActivity.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100 text-stone-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#167A4A]" />
            <span>{assignedActivity.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{assignedActivity.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>Teacher: {assignedActivity.supervisorTeacher}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Cohort: {assignedActivity.studentCount} Students</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setSelectedHotspotId(assignedActivity.hotspotId)}
            className="text-xs text-stone-600 hover:text-stone-900 font-medium"
          >
            Inspect Site History
          </button>
          <button
            type="button"
            onClick={() => setIsActivityModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#167A4A] text-white text-xs font-semibold hover:bg-[#12633C] transition-colors"
          >
            Open Checklist & Handover →
          </button>
        </div>
      </div>

      {/* Past Completed Drives */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Past Activity Record
        </h2>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#167A4A]">H-009</span>
              <span className="font-semibold text-[#17201B]">Sector 4 Perimeter Drive</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              12 Apr 2025 · 84 kg dry recyclables sorted · Marked Sustained Clean
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};
