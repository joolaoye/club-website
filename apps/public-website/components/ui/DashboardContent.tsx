"use client";

import { EventsTeaser } from "@club-website/ui/components/events/EventsTeaser";
import { AnnouncementTeaser } from "@club-website/ui/components/announcements/AnnouncementTeaser";
import Link from 'next/link';

export function DashboardContent() {

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Events Container - Left */}
        <div className="h-full">
          <EventsTeaser 
            LinkComponent={Link}
          />
        </div>

        {/* Announcements Container - Right */}
        <div className="h-full">
          <AnnouncementTeaser
            LinkComponent={Link}
          />
        </div>
      </div>
    </div>
  );
}
