"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@workspace/ui/components/dialog";
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
import { EventCard } from "@workspace/ui/components/events/EventCard";
import { formatDate } from "@workspace/ui/lib/utils";
import { useNavigation } from "@/components/navigation/NavigationContext";

// Mock data - replace with actual API calls
const mockEvents: Event[] = [
  { id: '1', title: 'Intro to React Workshop', description: 'Learn the fundamentals of React and build a simple project.', startTime: '2024-08-10T14:00:00Z', endTime: '2024-08-10T16:00:00Z', location: 'Room 101', currentAttendees: 25, maxAttendees: 30, rsvps: [] },
  { id: '2', title: 'First General Meeting', description: 'Join us for our first general meeting of the semester.', startTime: '2024-08-05T18:00:00Z', endTime: '2024-08-05T19:00:00Z', location: 'Auditorium', currentAttendees: 50, maxAttendees: 100, rsvps: [] },
  { id: '3', title: 'Past Tech Talk', description: 'A talk on the future of AI.', startTime: '2023-04-20T17:00:00Z', endTime: '2023-04-20T18:00:00Z', location: 'Online', currentAttendees: 40, rsvps: [] },
];

interface EventRSVP {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees?: number;
  currentAttendees: number;
  rsvps: EventRSVP[];
}

export default function EventsView() {
  const [events] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRSVPs, setShowRSVPs] = useState(false);
  const { setView } = useNavigation();

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter(event => new Date(event.startTime) > now);
    const past = events.filter(event => new Date(event.startTime) <= now);
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const handleCreateEvent = () => {
    setView('events', 'create');
  };

  const handleEditEvent = (eventId: string) => {
    setView('events', 'edit', { id: eventId });
  };

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
                <EventCard event={event} LinkComponent={() => <div />} />
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
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowRSVPs(true);
                    }}
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
                <EventCard event={event} LinkComponent={() => <div />} />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowRSVPs(true);
                    }}
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
                  Total RSVPs: {selectedEvent.rsvps.length}
                </p>
              </div>
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {selectedEvent.rsvps.map((rsvp) => (
                  <div key={rsvp.id} className="text-sm">
                    {rsvp.name} ({rsvp.email})
                  </div>
                ))}
                {selectedEvent.rsvps.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No RSVPs to display for this event.
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 
