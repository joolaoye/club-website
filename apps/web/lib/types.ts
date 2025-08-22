// Backend API types
export interface BackendEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  created_by: {
    id: number;
    full_name: string;
    email: string;
  } | null;
  created_at: string;
  updated_at: string;
  is_upcoming: boolean;
  rsvp_count: number;
}

export interface BackendAnnouncement {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  created_by: {
    id: number;
    full_name: string;
    email: string;
  } | null;
  created_at: string;
}

export interface BackendOfficer {
  id: number;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  full_name: string;
  email: string;
  position: string;
  bio: string | null;
  image_url: string | null;
  order_index: number;
}

// Frontend-compatible types (transformed from backend)
export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees?: number;
  currentAttendees: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Officer {
  id: string;
  name: string;
  role: string;
  year?: string;
  program?: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
  github?: string;
}

// Transform functions
export function transformEvent(backendEvent: BackendEvent): Event {
  return {
    id: backendEvent.id.toString(),
    title: backendEvent.title,
    description: backendEvent.description || '',
    startTime: backendEvent.event_date,
    endTime: backendEvent.event_date, // Backend only has single date, use same for both
    location: backendEvent.location || '',
    currentAttendees: backendEvent.rsvp_count || 0,
    // maxAttendees is not available from backend
  };
}

export function transformAnnouncement(backendAnnouncement: BackendAnnouncement): Announcement {
  return {
    id: backendAnnouncement.id.toString(),
    title: backendAnnouncement.title,
    content: backendAnnouncement.content,
    isPinned: backendAnnouncement.pinned,
    createdAt: backendAnnouncement.created_at,
    updatedAt: backendAnnouncement.created_at, // Backend doesn't have updated_at for announcements
  };
}

export function transformOfficer(backendOfficer: BackendOfficer): Officer {
  return {
    id: backendOfficer.id.toString(),
    name: backendOfficer.full_name,
    role: backendOfficer.position,
    bio: backendOfficer.bio || '',
    image: backendOfficer.image_url || undefined,
    email: backendOfficer.email || undefined,
    // year and program are not available from backend
    // linkedin and github are not available from backend
  };
} 