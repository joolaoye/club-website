"use client";

import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import { UpcomingEvents } from "@workspace/ui/components/events/UpcomingEvents";
import { AnnouncementContainer } from "@workspace/ui/components/announcements/AnnouncementContainer";
import Link from 'next/link';
import { useAnnouncements } from "@/hooks/useAnnouncements";

export function DashboardContent() {
  const { events, loading: eventsLoading, error: eventsError } = useUpcomingEvents();
  const { announcements, loading: announcementsLoading, error: announcementsError } = useAnnouncements();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Events Container - Left */}
        <div className="h-full">
          <UpcomingEvents 
            events={events} 
            loading={eventsLoading} 
            error={eventsError} 
            LinkComponent={Link}
          />
        </div>

        {/* Announcements Container - Right */}
        <div className="h-full">
          <AnnouncementContainer
            announcements={announcements}
            loading={announcementsLoading}
            error={announcementsError}
            LinkComponent={Link}
          />
        </div>
      </div>
    </div>
  );
} 