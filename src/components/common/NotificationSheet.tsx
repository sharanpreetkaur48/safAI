import React from 'react';
import { X, CheckCircle, Bell, ArrowRight, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationSheet: React.FC = () => {
  const {
    isNotificationSheetOpen,
    setIsNotificationSheetOpen,
    notifications,
    markNotificationAsRead,
    setSelectedHotspotId,
  } = useApp();

  if (!isNotificationSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#F7F8F6] h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#167A4A]" />
            <h2 className="text-base font-bold text-[#17201B]">Notifications</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsNotificationSheetOpen(false)}
            className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              No recent notifications
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationAsRead(item.id);
                  if (item.targetHotspotId) {
                    setSelectedHotspotId(item.targetHotspotId);
                    setIsNotificationSheetOpen(false);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-white border-stone-200 text-stone-600'
                    : 'bg-white border-[#167A4A]/30 shadow-sm ring-1 ring-[#167A4A]/10'
                } hover:border-[#167A4A]`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs text-[#17201B] flex items-center gap-1.5">
                    {!item.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#167A4A] shrink-0" />
                    )}
                    {item.title}
                  </div>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap">{item.timeAgo}</span>
                </div>

                <p className="text-xs text-[#6B746E] mt-1.5 leading-relaxed">
                  {item.message}
                </p>

                {item.targetHotspotId && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-medium text-[#167A4A]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      View {item.targetHotspotId}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
