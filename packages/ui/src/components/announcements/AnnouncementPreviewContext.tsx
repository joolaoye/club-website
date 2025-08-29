"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface Announcement {
  id: string;
  content: string;
  display_text?: string;
  pinned: boolean;
  is_draft: boolean;
  discord_message_id?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

interface AnnouncementPreviewContextType {
  isOpen: boolean;
  announcement: Announcement | null;
  openPreview: (announcement: Announcement) => void;
  closePreview: () => void;
}

const AnnouncementPreviewContext = createContext<AnnouncementPreviewContextType | undefined>(undefined);

interface AnnouncementPreviewProviderProps {
  children: ReactNode;
}

export function AnnouncementPreviewProvider({ children }: AnnouncementPreviewProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const openPreview = (announcement: Announcement) => {
    setAnnouncement(announcement);
    setIsOpen(true);
  };

  const closePreview = () => {
    setIsOpen(false);
    setAnnouncement(null);
  };

  return (
    <AnnouncementPreviewContext.Provider
      value={{
        isOpen,
        announcement,
        openPreview,
        closePreview,
      }}
    >
      {children}
    </AnnouncementPreviewContext.Provider>
  );
}

export function useAnnouncementPreview() {
  const context = useContext(AnnouncementPreviewContext);
  if (context === undefined) {
    throw new Error('useAnnouncementPreview must be used within an AnnouncementPreviewProvider');
  }
  return context;
}
