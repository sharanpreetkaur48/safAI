import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  Hotspot,
  AssignedActivity,
  EcoClub,
  ParticipatingSchool,
  UserProfile,
  NotificationItem,
  Observation,
  SeverityLevel,
} from '../types';
import {
  INITIAL_HOTSPOTS,
  INITIAL_ASSIGNED_ACTIVITY,
  INITIAL_CLUBS,
  INITIAL_SCHOOLS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matchedHotspot?: Hotspot;
  distanceMeters?: number;
  existingObservationsCount?: number;
  observationId: string;
}

interface AppContextType {
  // Role & Startup
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasCompletedStartup: boolean;
  setHasCompletedStartup: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Modals & Panels
  isRoleSelectorOpen: boolean;
  setIsRoleSelectorOpen: (open: boolean) => void;
  isObserveModalOpen: boolean;
  setIsObserveModalOpen: (open: boolean) => void;
  isAssignModalOpen: boolean;
  setIsAssignModalOpen: (open: boolean) => void;
  assignTargetHotspot: Hotspot | null;
  setAssignTargetHotspot: (hotspot: Hotspot | null) => void;
  isActivityModalOpen: boolean;
  setIsActivityModalOpen: (open: boolean) => void;
  isNotificationSheetOpen: boolean;
  setIsNotificationSheetOpen: (open: boolean) => void;
  selectedHotspotId: string | null;
  setSelectedHotspotId: (id: string | null) => void;

  // Data
  hotspots: Hotspot[];
  currentHotspot: Hotspot | null;
  assignedActivity: AssignedActivity;
  clubs: EcoClub[];
  schools: ParticipatingSchool[];
  notifications: NotificationItem[];
  userProfile: UserProfile;
  unreadNotificationCount: number;

  // Offline simulation
  isOffline: boolean;
  toggleOffline: () => void;
  offlineQueueCount: number;

  // Actions
  submitObservation: (obs: Partial<Observation>) => DuplicateDetectionResult;
  assignHotspotToClub: (
    hotspotId: string,
    clubName: string,
    teacher: string,
    date: string,
    time: string,
    students: number,
    permittedTasks: string[]
  ) => void;
  completeActivityChecklist: (checklistIds: string[]) => void;
  submitSegregationHandover: (record: {
    totalKg: number;
    dryKg: number;
    wetKg: number;
    sanitaryKg: number;
    otherKg: number;
    channel: string;
  }) => void;
  municipalVerifyHotspot: (hotspotId: string, priority: SeverityLevel, notes?: string) => void;
  municipalAssignTeam: (hotspotId: string, teamName: string) => void;
  municipalRecordCleaning: (hotspotId: string, notes: string) => void;
  municipalFollowUp: (
    hotspotId: string,
    result: 'Sustained Clean' | 'Needs Follow-up' | 'Recurring',
    notes: string
  ) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('student');
  const [hasCompletedStartup, setHasCompletedStartup] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [isObserveModalOpen, setIsObserveModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetHotspot, setAssignTargetHotspot] = useState<Hotspot | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  // Offline
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Domain data
  const [hotspots, setHotspots] = useState<Hotspot[]>(INITIAL_HOTSPOTS);
  const [assignedActivity, setAssignedActivity] = useState<AssignedActivity>(INITIAL_ASSIGNED_ACTIVITY);
  const [clubs, setClubs] = useState<EcoClub[]>(INITIAL_CLUBS);
  const [schools, setSchools] = useState<ParticipatingSchool[]>(INITIAL_SCHOOLS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr-aarav',
    name: 'Aarav Sharma',
    role: 'student',
    schoolName: 'Green Valley High School',
    grade: 'Class 10',
    section: 'Section B',
    studentId: 'GV-2024-104',
    mobile: '+91 98112 44910',
    email: 'aarav.sharma@student.gvhs.edu',
    contributions: {
      verifiedObservations: 3,
      supervisedActivities: 2,
      successfulFollowUps: 1,
      sustainedCleanContributions: 1,
    },
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'student') {
      setActiveTab('home');
      setUserProfile((prev) => ({
        ...prev,
        role: 'student',
        name: 'Aarav Sharma',
      }));
    } else if (newRole === 'school') {
      setActiveTab('dashboard');
      setUserProfile((prev) => ({
        ...prev,
        role: 'school',
        name: 'Dr. Meera Singh',
        schoolName: 'Green Valley High School',
      }));
    } else {
      setActiveTab('dashboard');
      setUserProfile((prev) => ({
        ...prev,
        role: 'municipality',
        name: 'R. K. Verma',
        department: 'Ward 12 Sanitation Division',
        zone: 'Central Urban Circle',
      }));
    }
  };

  const toggleOffline = () => {
    if (isOffline && offlineQueueCount > 0) {
      // Syncing
      setOfflineQueueCount(0);
      setNotifications((prev) => [
        {
          id: `synced-${Date.now()}`,
          title: 'Offline observations synced',
          message: 'Your locally saved observations were sent to the municipal registry.',
          timeAgo: 'Just now',
          read: false,
          type: 'success',
        },
        ...prev,
      ]);
    }
    setIsOffline(!isOffline);
  };

  const currentHotspot = selectedHotspotId
    ? hotspots.find((h) => h.id === selectedHotspotId) || null
    : null;

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Student Flow: Submit observation with duplicate detection
  const submitObservation = (obs: Partial<Observation>): DuplicateDetectionResult => {
    const obsId = `O-${Math.floor(2000 + Math.random() * 900)}`;

    if (isOffline) {
      setOfflineQueueCount((c) => c + 1);
      return {
        isDuplicate: false,
        observationId: obsId,
      };
    }

    // Check spatial proximity to existing hotspot H-014 (Model Town drain edge)
    const targetHotspot = hotspots.find((h) => h.id === 'H-014') || hotspots[0];
    const isCloseToH014 = true; // In our prototype flow, Aarav observes Model Town drain edge

    if (isCloseToH014 && targetHotspot) {
      // Strengthen existing hotspot
      setHotspots((prev) =>
        prev.map((h) => {
          if (h.id === targetHotspot.id) {
            return {
              ...h,
              observationCount: h.observationCount + 1,
              timeline: [
                {
                  id: `tl-${Date.now()}`,
                  timestamp: 'Just now',
                  stage: 'Observed',
                  title: `Observation ${obsId} linked to ${h.id}`,
                  description: `${obs.wasteCategory || 'Mixed waste'} logged with GPS verification. Location matches existing physical hotspot.`,
                  actor: userProfile.name,
                  role: `${userProfile.role === 'student' ? 'Student' : 'Citizen'}, ${userProfile.schoolName || 'Civic Scout'}`,
                  verified: true,
                },
                ...h.timeline,
              ],
            };
          }
          return h;
        })
      );

      // Increment student's contribution count
      setUserProfile((prev) => ({
        ...prev,
        contributions: {
          ...prev.contributions,
          verifiedObservations: prev.contributions.verifiedObservations + 1,
        },
      }));

      // Add notification
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: `Observation ${obsId} linked to ${targetHotspot.id}`,
          message: `Your observation was matched 42 m from existing hotspot ${targetHotspot.name}. Hotspot record strengthened.`,
          timeAgo: 'Just now',
          read: false,
          targetHotspotId: targetHotspot.id,
          type: 'info',
        },
        ...prev,
      ]);

      return {
        isDuplicate: true,
        matchedHotspot: targetHotspot,
        distanceMeters: 42,
        existingObservationsCount: targetHotspot.observationCount,
        observationId: obsId,
      };
    }

    return {
      isDuplicate: false,
      observationId: obsId,
    };
  };

  // School Flow: Assign Area
  const assignHotspotToClub = (
    hotspotId: string,
    clubName: string,
    teacher: string,
    date: string,
    time: string,
    students: number,
    permittedTasks: string[]
  ) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === hotspotId) {
          return {
            ...h,
            status: 'Assigned',
            assignedClub: clubName,
            assignedSchool: 'Green Valley High School',
            timeline: [
              {
                id: `tl-assign-${Date.now()}`,
                timestamp: 'Just now',
                stage: 'Activity',
                title: `Area assigned to ${clubName}`,
                description: `Supervised by ${teacher} for ${date} at ${time}. ${students} students participating in safe segregation & awareness.`,
                actor: teacher,
                role: 'School Coordinator',
                verified: true,
              },
              ...h.timeline,
            ],
          };
        }
        return h;
      })
    );

    // Update active assigned activity
    setAssignedActivity({
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      hotspotId,
      hotspotName: hotspots.find((h) => h.id === hotspotId)?.locationName || 'Model Town drain edge',
      hotspotLocation: hotspots.find((h) => h.id === hotspotId)?.landmark || 'Behind Community Market Gate 3',
      schoolName: 'Green Valley High School',
      clubName,
      supervisorTeacher: teacher,
      date,
      time,
      studentCount: students,
      status: 'Assigned',
      permittedTasks,
      checklist: [
        { id: 'c1', title: 'Attend teacher safety briefing', completed: false },
        { id: 'c2', title: 'Observe the area and record baseline perimeter', completed: false },
        { id: 'c3', title: 'Complete safe dry segregation into color-coded sacks', completed: false },
        { id: 'c4', title: 'Capture site evidence and log municipal handover', completed: false },
      ],
    });

    // Notify students
    setNotifications((prev) => [
      {
        id: `notif-assigned-${Date.now()}`,
        title: `New activity assigned: ${hotspotId}`,
        message: `${clubName} scheduled a supervised activity on ${date} at ${time}.`,
        timeAgo: 'Just now',
        read: false,
        targetHotspotId: hotspotId,
        type: 'action',
      },
      ...prev,
    ]);
  };

  // Student Flow: Complete Activity Checklist
  const completeActivityChecklist = (checklistIds: string[]) => {
    setAssignedActivity((prev) => ({
      ...prev,
      status: 'In Progress',
      checklist: prev.checklist.map((item) => ({
        ...item,
        completed: checklistIds.includes(item.id),
      })),
    }));
  };

  // Student Flow: Submit Segregation & Handover
  const submitSegregationHandover = (record: {
    totalKg: number;
    dryKg: number;
    wetKg: number;
    sanitaryKg: number;
    otherKg: number;
    channel: string;
  }) => {
    const timestamp = 'Today, 9:45 AM';

    setAssignedActivity((prev) => ({
      ...prev,
      status: 'Completed',
      segregationRecord: {
        totalKg: record.totalKg,
        dryKg: record.dryKg,
        wetKg: record.wetKg,
        sanitaryKg: record.sanitaryKg,
        otherKg: record.otherKg,
        handoverChannel: record.channel,
        handoverTimestamp: timestamp,
        verified: true,
      },
    }));

    // Update hotspot timeline & evidence
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === assignedActivity.hotspotId) {
          return {
            ...h,
            status: 'Actioned',
            timeline: [
              {
                id: `tl-handover-${Date.now()}`,
                timestamp: 'Just now',
                stage: 'Activity',
                title: 'Segregation & Handover verified',
                description: `${record.totalKg} kg waste safely segregated (Dry: ${record.dryKg}kg, Wet: ${record.wetKg}kg) and handed over to ${record.channel}.`,
                actor: assignedActivity.supervisorTeacher,
                role: 'Supervising Teacher & Municipal Crew',
                verified: true,
              },
              ...h.timeline,
            ],
          };
        }
        return h;
      })
    );

    // Update student contributions
    setUserProfile((prev) => ({
      ...prev,
      contributions: {
        ...prev.contributions,
        supervisedActivities: prev.contributions.supervisedActivities + 1,
      },
    }));

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-handover-${Date.now()}`,
        title: 'Activity completed & handover recorded',
        message: `${record.totalKg}kg segregated waste verified by municipal driver. Handover record submitted.`,
        timeAgo: 'Just now',
        read: false,
        targetHotspotId: assignedActivity.hotspotId,
        type: 'success',
      },
      ...prev,
    ]);
  };

  // Municipal Flow: Verify Hotspot
  const municipalVerifyHotspot = (hotspotId: string, priority: SeverityLevel, notes?: string) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === hotspotId) {
          return {
            ...h,
            status: 'Verified',
            severity: priority,
            timeline: [
              {
                id: `tl-muni-verify-${Date.now()}`,
                timestamp: 'Just now',
                stage: 'Validated',
                title: `Physical verification completed by Ward 12`,
                description: notes || `Sanitation supervisor confirmed location and established persistent ID ${h.id}. Priority set to ${priority}.`,
                actor: 'R. K. Verma',
                role: 'Sanitation Inspector, Ward 12',
                verified: true,
              },
              ...h.timeline,
            ],
          };
        }
        return h;
      })
    );
  };

  // Municipal Flow: Assign Team
  const municipalAssignTeam = (hotspotId: string, teamName: string) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === hotspotId) {
          return {
            ...h,
            status: 'Assigned',
            assignedTeam: teamName,
            timeline: [
              {
                id: `tl-muni-team-${Date.now()}`,
                timestamp: 'Just now',
                stage: 'Actioned',
                title: `Assigned to ${teamName}`,
                description: 'Scheduled for mechanized clearance and perimeter sanitization route.',
                actor: 'R. K. Verma',
                role: 'Sanitation Inspector',
                verified: true,
              },
              ...h.timeline,
            ],
          };
        }
        return h;
      })
    );
  };

  // Municipal Flow: Record Cleaning
  const municipalRecordCleaning = (hotspotId: string, notes: string) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === hotspotId) {
          return {
            ...h,
            status: 'Actioned',
            lastUpdated: 'Just now',
            timeline: [
              {
                id: `tl-muni-clean-${Date.now()}`,
                timestamp: 'Just now',
                stage: 'Actioned',
                title: 'Primary cleaning completed by Municipal Crew',
                description: notes || 'Mechanical clearance and ground washing completed. Before/after photographic evidence logged.',
                actor: h.assignedTeam || 'Ward 12 Sanitation Team',
                role: 'Municipal Field Team',
                verified: true,
              },
              ...h.timeline,
            ],
            recurrenceHistory: [
              {
                date: 'Today',
                status: 'Cleaned',
                notes: notes || 'Primary clearance completed. Area scheduled for recurrence monitoring.',
                clearedBy: h.assignedTeam || 'Ward 12 Sanitation Team',
              },
              ...h.recurrenceHistory,
            ],
          };
        }
        return h;
      })
    );
  };

  // Municipal Flow: Follow up inspection
  const municipalFollowUp = (
    hotspotId: string,
    result: 'Sustained Clean' | 'Needs Follow-up' | 'Recurring',
    notes: string
  ) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.id === hotspotId) {
          const isRecurringResult = result === 'Recurring';
          const isSustainedClean = result === 'Sustained Clean';

          return {
            ...h,
            status: result,
            isRecurring: isRecurringResult,
            recurrenceCount: isRecurringResult ? h.recurrenceCount + 1 : h.recurrenceCount,
            lastUpdated: 'Just now',
            timeline: [
              {
                id: `tl-muni-follow-${Date.now()}`,
                timestamp: 'Just now',
                stage: isSustainedClean ? 'Sustained Clean' : 'Follow-up',
                title: `Follow-up audit: ${result}`,
                description: notes,
                actor: 'R. K. Verma & Joint Audit Team',
                role: 'Ward 12 Sanitation Inspection',
                verified: true,
              },
              ...h.timeline,
            ],
            recurrenceHistory: [
              {
                date: 'Today',
                status: result,
                notes,
              },
              ...h.recurrenceHistory,
            ],
          };
        }
        return h;
      })
    );

    if (result === 'Sustained Clean') {
      setUserProfile((prev) => ({
        ...prev,
        contributions: {
          ...prev.contributions,
          sustainedCleanContributions: prev.contributions.sustainedCleanContributions + 1,
        },
      }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        hasCompletedStartup,
        setHasCompletedStartup,
        activeTab,
        setActiveTab,
        isRoleSelectorOpen,
        setIsRoleSelectorOpen,
        isObserveModalOpen,
        setIsObserveModalOpen,
        isAssignModalOpen,
        setIsAssignModalOpen,
        assignTargetHotspot,
        setAssignTargetHotspot,
        isActivityModalOpen,
        setIsActivityModalOpen,
        isNotificationSheetOpen,
        setIsNotificationSheetOpen,
        selectedHotspotId,
        setSelectedHotspotId,
        hotspots,
        currentHotspot,
        assignedActivity,
        clubs,
        schools,
        notifications,
        userProfile,
        unreadNotificationCount,
        isOffline,
        toggleOffline,
        offlineQueueCount,
        submitObservation,
        assignHotspotToClub,
        completeActivityChecklist,
        submitSegregationHandover,
        municipalVerifyHotspot,
        municipalAssignTeam,
        municipalRecordCleaning,
        municipalFollowUp,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
