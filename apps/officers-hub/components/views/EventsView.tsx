"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@club-website/ui/components/card";
import { Button } from "@club-website/ui/components/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@club-website/ui/components/dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Eye
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useMemo, useState } from "react";
import { EventCard } from "@club-website/ui/components/events/EventCard";
import { formatDate } from "@club-website/ui/lib/utils";
import { useNavigation } from "@/components/navigation/NavigationContext";
import { toEventUIProps } from "@/lib/adapters";
import type { Event, EventRSVP } from "@/lib/api";

// Types are imported from lib/api

export default function EventsView() {
  const { events, loading, error, getRSVPs } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventRSVPs, setSelectedEventRSVPs] = useState<EventRSVP[]>([]);
  const [showRSVPs, setShowRSVPs] = useState(false);
  const [loadingRSVPs, setLoadingRSVPs] = useState(false);
  const { setView } = useNavigation();

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter(event => event.scheduledAt > now);
    const past = events.filter(event => event.scheduledAt <= now);
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const handleCreateEvent = () => {
    setView('events', 'create');
  };

  const handleEditEvent = (eventId: string) => {
    setView('events', 'edit', { id: eventId });
  };

  const handleViewRSVPs = async (event: Event) => {
    setSelectedEvent(event);
    setShowRSVPs(true);
    setLoadingRSVPs(true);
    try {
      const rsvps = await getRSVPs(event.id);
      setSelectedEventRSVPs(rsvps);
    } catch (error) {
      console.error('Failed to load RSVPs:', error);
      setSelectedEventRSVPs([]);
    } finally {
      setLoadingRSVPs(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load events: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage club events and view RSVPs</p>
        </div>
        <Button onClick={handleCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="relative">
                <EventCard event={toEventUIProps(event)} LinkComponent={() => <div />} />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEvent(event.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewRSVPs(event)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">No upcoming events</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map((event) => (
              <div key={event.id} className="relative">
                <EventCard event={toEventUIProps(event)} LinkComponent={() => <div />} />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewRSVPs(event)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {pastEvents.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">No past events</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      {selectedEvent && (
        <Dialog open={showRSVPs} onOpenChange={setShowRSVPs}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>RSVPs for {selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Total RSVPs: {selectedEventRSVPs.length}
                </p>
              </div>
              {loadingRSVPs ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading RSVPs...</p>
                </div>
              ) : (
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  {selectedEventRSVPs.map((rsvp) => (
                    <div key={rsvp.id} className="text-sm">
                      {rsvp.name} ({rsvp.email})
                    </div>
                  ))}
                  {selectedEventRSVPs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No RSVPs to display for this event.
                    </p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 
