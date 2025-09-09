"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface EventPreviewContextType {
  isOpen: boolean;
  event: Event | null;
  openPreview: (event: Event) => void;
  closePreview: () => void;
}

const EventPreviewContext = createContext<EventPreviewContextType | undefined>(undefined);

interface EventPreviewProviderProps {
  children: ReactNode;
}

export function EventPreviewProvider({ children }: EventPreviewProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);

  const openPreview = (event: Event) => {
    setEvent(event);
    setIsOpen(true);
  };

  const closePreview = () => {
    setIsOpen(false);
    // Keep event data for a moment to allow for smooth closing animation
    setTimeout(() => setEvent(null), 150);
  };

  return (
    <EventPreviewContext.Provider value={{
      isOpen,
      event,
      openPreview,
      closePreview,
    }}>
      {children}
    </EventPreviewContext.Provider>
  );
}

export function useEventPreview() {
  const context = useContext(EventPreviewContext);
  if (context === undefined) {
    throw new Error('useEventPreview must be used within an EventPreviewProvider');
  }
  return context;
}
