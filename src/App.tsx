import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { StudentHome } from './components/student/StudentHome';
import { StudentActivitiesView } from './components/student/StudentActivitiesView';
import { SchoolDashboard } from './components/school/SchoolDashboard';
import { MunicipalDashboard } from './components/municipal/MunicipalDashboard';
import { HotspotMap } from './components/hotspot/HotspotMap';
import { HotspotDetail } from './components/hotspot/HotspotDetail';
import { ProfileView } from './components/profile/ProfileView';
import { RoleSelectorModal } from './components/common/RoleSelectorModal';
import { ObserveCameraModal } from './components/student/ObserveCameraModal';
import { AssignAreaModal } from './components/school/AssignAreaModal';
import { ActivityChecklistModal } from './components/student/ActivityChecklistModal';
import { NotificationSheet } from './components/common/NotificationSheet';
import { WifiOff, Sparkles, Shield, ArrowRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, activeTab, selectedHotspotId, isOffline, offlineQueueCount, toggleOffline } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#17201B] flex flex-col font-sans">
      {/* Top Bar (adheres to 3-zone contract) */}
      <TopBar />

      {/* Subtle Offline Banner when connectivity is off in field */}
      {isOffline && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-xl">
            <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Field Offline Mode:</strong> Observations will be cached locally and synced when connection resumes ({offlineQueueCount} queued).
            </span>
          </div>
          <button
            type="button"
            onClick={toggleOffline}
            className="text-amber-800 font-semibold hover:underline text-xs"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {selectedHotspotId ? (
          <HotspotDetail />
        ) : (
          <>
            {/* Student Persona Views */}
            {role === 'student' && (
              <>
                {activeTab === 'home' && <StudentHome />}
                {activeTab === 'hotspots' && <HotspotMap />}
                {activeTab === 'activities' && <StudentActivitiesView />}
                {activeTab === 'profile' && <ProfileView />}
              </>
            )}

            {/* School Coordinator Persona Views */}
            {role === 'school' && (
              <>
                {(activeTab === 'dashboard' || activeTab === 'clubs' || activeTab === 'schools') && (
                  <SchoolDashboard />
                )}
                {activeTab === 'hotspots' && <HotspotMap />}
                {activeTab === 'profile' && <ProfileView />}
              </>
            )}

            {/* Municipal Persona Views */}
            {role === 'municipality' && (
              <>
                {(activeTab === 'dashboard' || activeTab === 'worklist' || activeTab === 'history') && (
                  <MunicipalDashboard />
                )}
                {activeTab === 'hotspots' && <HotspotMap />}
                {activeTab === 'profile' && <ProfileView />}
              </>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Interactive Modals & Drawers */}
      <RoleSelectorModal />
      <ObserveCameraModal />
      <AssignAreaModal />
      <ActivityChecklistModal />
      <NotificationSheet />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
