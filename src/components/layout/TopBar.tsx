import React from 'react';
import { Bell, Users, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC = () => {
  const {
    role,
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    setIsNotificationSheetOpen,
    setIsRoleSelectorOpen,
    isOffline,
    toggleOffline,
  } = useApp();

  const getNavItems = () => {
    if (role === 'student') {
      return [
        { id: 'home', label: 'Home' },
        { id: 'hotspots', label: 'Hotspots' },
        { id: 'activities', label: 'Activities' },
        { id: 'profile', label: 'Profile' },
      ];
    } else if (role === 'school') {
      return [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'hotspots', label: 'Hotspots' },
        { id: 'clubs', label: 'Clubs' },
        { id: 'schools', label: 'Schools' },
        { id: 'profile', label: 'Profile' },
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'hotspots', label: 'Hotspots' },
        { id: 'worklist', label: 'Work' },
        { id: 'history', label: 'History' },
        { id: 'profile', label: 'Profile' },
      ];
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    if (role === 'student') return 'Student';
    if (role === 'school') return 'School Coordinator';
    return 'Municipality';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F7F8F6]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setActiveTab(role === 'student' ? 'home' : 'dashboard')}
          className="text-xl font-bold tracking-tight text-[#167A4A] hover:text-[#12633C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A4A] rounded"
        >
          safAI
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors hover:text-stone-900 whitespace-nowrap pb-0.5 ${
                activeTab === item.id
                  ? 'text-[#167A4A] font-semibold border-b-2 border-[#167A4A]'
                  : 'text-stone-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline quick toggle (demonstrates civic resilience in low-connectivity zones) */}
          <button
            type="button"
            onClick={toggleOffline}
            title={isOffline ? 'Offline mode active (Click to simulate online)' : 'Online (Click to simulate field offline)'}
            className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors hidden sm:flex items-center gap-1.5 ${
              isOffline
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span>{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* Role switcher button */}
          <button
            type="button"
            onClick={() => setIsRoleSelectorOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-[#E8F4ED] text-[#167A4A] hover:bg-[#d6ecdf] transition-colors border border-[#167A4A]/20"
            title="Switch User Role"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{getRoleLabel()}</span>
            <span className="sm:hidden">{role === 'student' ? 'Student' : role === 'school' ? 'School' : 'Muni'}</span>
          </button>

          {/* Notification icon */}
          <button
            type="button"
            onClick={() => setIsNotificationSheetOpen(true)}
            className="relative p-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A4A]"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#167A4A]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
