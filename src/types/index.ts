export type UserRole = 'student' | 'school' | 'municipality';

export type WasteCategory =
  | 'Wet / Organic'
  | 'Dry / Recyclable'
  | 'Sanitary'
  | 'Construction & Demolition'
  | 'Bulky'
  | 'Special / Hazardous';

export type SeverityLevel = 'Low' | 'Medium' | 'High';

export type HotspotStatus =
  | 'Observed'
  | 'Verified'
  | 'Assigned'
  | 'Actioned'
  | 'Needs Follow-up'
  | 'Recurring'
  | 'Sustained Clean';

export interface Observation {
  id: string;
  hotspotId?: string;
  submittedBy: string;
  submitterRole: 'student' | 'citizen';
  schoolName?: string;
  timestamp: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  wasteCategory: WasteCategory;
  severity: SeverityLevel;
  notes?: string;
  status: 'pending_verification' | 'linked_to_hotspot' | 'verified';
  photoUrl?: string;
}

export interface HotspotTimelineEvent {
  id: string;
  timestamp: string;
  stage: 'Observed' | 'Validated' | 'Created' | 'Actioned' | 'Activity' | 'Follow-up' | 'Sustained Clean';
  title: string;
  description: string;
  actor: string;
  role: string;
  verified?: boolean;
}

export interface RecurrenceLog {
  date: string;
  status: 'Recurring' | 'Cleaned' | 'Verified' | 'Sustained Clean' | 'Needs Follow-up';
  notes: string;
  clearedBy?: string;
}

export interface Hotspot {
  id: string; // e.g. H-014
  name: string;
  locationName: string;
  landmark: string;
  distanceKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  primaryWaste: WasteCategory;
  wasteBreakdown?: {
    category: WasteCategory;
    percentage: number;
  }[];
  severity: SeverityLevel;
  status: HotspotStatus;
  isRecurring: boolean;
  recurrenceCount: number;
  ward: string;
  lastUpdated: string;
  observationCount: number;
  assignedTeam?: string;
  assignedClub?: string;
  assignedSchool?: string;
  activeActivityId?: string;
  heroImage: string;
  evidence: {
    before?: string;
    after?: string;
    activity?: string;
    handover?: string;
  };
  timeline: HotspotTimelineEvent[];
  recurrenceHistory: RecurrenceLog[];
}

export interface AssignedActivity {
  id: string;
  hotspotId: string;
  hotspotName: string;
  hotspotLocation: string;
  schoolName: string;
  clubName: string;
  supervisorTeacher: string;
  date: string;
  time: string;
  studentCount: number;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Verified';
  permittedTasks: string[];
  checklist: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  segregationRecord?: {
    totalKg: number;
    dryKg: number;
    wetKg: number;
    sanitaryKg: number;
    otherKg: number;
    handoverChannel: string;
    handoverTimestamp: string;
    verified: boolean;
  };
}

export interface EcoClub {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  memberCount: number;
  coordinatorTeacher: string;
  activitiesCompleted: number;
  activeHotspotIds: string[];
}

export interface ParticipatingSchool {
  id: string;
  name: string;
  schoolCode: string;
  city: string;
  type: 'Government' | 'Private' | 'Other';
  coordinatorName: string;
  clubCount: number;
  studentCount: number;
  verifiedContributions: number;
  rank: number;
  status: 'Verified' | 'Pending Verification';
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  schoolName?: string;
  grade?: string;
  section?: string;
  studentId?: string;
  mobile?: string;
  email?: string;
  department?: string;
  zone?: string;
  contributions: {
    verifiedObservations: number;
    supervisedActivities: number;
    successfulFollowUps: number;
    sustainedCleanContributions: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  targetHotspotId?: string;
  type: 'info' | 'success' | 'action' | 'alert';
}
