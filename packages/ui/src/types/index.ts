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
  author?: string;
  publishedAt: string;
  isPinned?: boolean;
}

export interface Officer {
  id: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  photoUrl: string;
  joinedAt: string;
  isActive: boolean;
}

export interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
} 