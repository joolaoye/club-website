"use client";

import React from 'react';
import { EventCardBase } from '@club-website/ui/components/events/EventCardBase';
import { useEventPreview } from '@club-website/ui/components/events/EventPreviewContext';

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: Date;
  endAt: Date;
  meetingLink: string | null;
  slidesUrl: string | null;
  recordingUrl: string | null;
  status: 'upcoming' | 'ongoing' | 'past';
  rsvpCount: number;
  canRsvp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EventCardPublicProps {
  event: Event;
  className?: string;
}

export function EventCardPublic({ 
  event, 
  className 
}: EventCardPublicProps) {
  const { openPreview } = useEventPreview();
  
  const handleClick = () => {
    openPreview(event);
  };

  // Public site configuration:
  // - No status badge (handled by tab view)
  // - No attendee count (removed per requirements)
  // - Uses EventPreviewContext for modal functionality
  
  return (
    <EventCardBase
      event={event}
      showStatusBadge={false}
      showAttendeeCount={false}
      className={className}
      onClick={handleClick}
    />
  );
}
