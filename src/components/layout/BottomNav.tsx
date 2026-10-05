import React from 'react';
import { Home, MapPin, Plus, Calendar, User, LayoutDashboard, Users, Clock, ClipboardList, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { role, activeTab, setActiveTab, setIsObserveModalOpen } = useApp();

  if (role === 'student') {
    return (
      <nav
        aria-label="Student mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F8F6]/95 backdrop-blur-md border-t border-stone-200 md:hidden h-16 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-full px-2 max-w-md mx-auto">
          {/* Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'home' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Home</span>
          </button>

          {/* Hotspots */}
          <button
            type="button"
            onClick={() => setActiveTab('hotspots')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'hotspots' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Hotspots</span>
          </button>

          {/* Center Observe Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsObserveModalOpen(true)}
              className="w-12 h-12 rounded-full bg-[#167A4A] text-white flex items-center justify-center shadow-md hover:bg-[#12633C] active:scale-95 transition-all -translate-y-2 border-2 border-[#F7F8F6]"
              aria-label="Report an Observation"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Activities */}
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'activities' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Activities</span>
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'profile' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>
        </div>
      </nav>
    );
  }

  if (role === 'school') {
    return (
      <nav
        aria-label="School mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F8F6]/95 backdrop-blur-md border-t border-stone-200 md:hidden h-16 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-full px-2 max-w-md mx-auto">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'dashboard' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Dashboard</span>
          </button>

          {/* Hotspots */}
          <button
            type="button"
            onClick={() => setActiveTab('hotspots')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'hotspots' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Hotspots</span>
          </button>

          {/* Clubs */}
          <button
            type="button"
            onClick={() => setActiveTab('clubs')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'clubs' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Clubs</span>
          </button>

          {/* Schools */}
          <button
            type="button"
            onClick={() => setActiveTab('schools')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'schools' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Schools</span>
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'profile' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>
        </div>
      </nav>
    );
  }

  // Municipality navigation
  return (
    <nav
      aria-label="Municipality mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F8F6]/95 backdrop-blur-md border-t border-stone-200 md:hidden h-16 pb-safe"
    >
      <div className="grid grid-cols-5 items-center h-full px-2 max-w-md mx-auto">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'dashboard' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Dashboard</span>
        </button>

        {/* Hotspots */}
        <button
          type="button"
          onClick={() => setActiveTab('hotspots')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'hotspots' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Hotspots</span>
        </button>

        {/* Work */}
        <button
          type="button"
          onClick={() => setActiveTab('worklist')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'worklist' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Work</span>
        </button>

        {/* History */}
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'history' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'profile' ? 'text-[#167A4A]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
