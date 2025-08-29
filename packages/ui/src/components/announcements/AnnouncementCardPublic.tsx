"use client";

import React from 'react';
import { AnnouncementCardBase } from '@workspace/ui/components/announcements/AnnouncementCardBase';
import { useAnnouncementPreview } from '@workspace/ui/components/announcements/AnnouncementPreviewContext';

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

interface AnnouncementCardPublicProps {
  announcement: Announcement;
  className?: string;
}

export function AnnouncementCardPublic({ 
  announcement, 
  className 
}: AnnouncementCardPublicProps) {
  const { openPreview } = useAnnouncementPreview();

  const handleClick = () => {
    openPreview(announcement);
  };

  // Public site only shows published announcements (filter out drafts at data level)
  // This component assumes the announcement is already published
  
  return (
    <AnnouncementCardBase
      announcement={announcement}
      showDraftBadge={false} // Public site never shows draft badge
      className={className}
      onClick={handleClick} // Enable preview functionality for public users
    />
  );
}
