"use client";

import { EventCard } from '@workspace/ui/components/events/EventCard';
import { EventSkeleton } from '@workspace/ui/components/events/EventSkeleton';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees?: number;
  currentAttendees: number;
}

interface UpcomingEventsProps {
  events?: Event[];
  loading?: boolean;
  error?: string | null;
  LinkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

export function UpcomingEvents({ events = [], loading = false, error, LinkComponent }: UpcomingEventsProps) {
  // Default to a regular anchor tag if no LinkComponent provided
  const Link = LinkComponent || (({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ));

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 h-fit">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">Upcoming Events</h2>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 h-fit">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">Upcoming Events</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Failed to load events</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Upcoming Events</h2>
        <Link 
          href="/events" 
          className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>
      
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.slice(0, 2).map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              LinkComponent={LinkComponent}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">No upcoming events</p>
          <p className="text-sm text-muted-foreground">Check back later for new events!</p>
        </div>
      )}
    </div>
  );
} 