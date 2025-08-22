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
import Link from 'next/link';
import { EventCard } from "@workspace/ui/components/events/EventCard";
import { formatDate } from "@workspace/ui/lib/utils";

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

enum EventStatus {
  UPCOMING = "Upcoming",
  PAST = "Past",
}

export default function EventsPage() {
  const [events] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRSVPs, setShowRSVPs] = useState(false);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter(event => new Date(event.startTime) > now);
    const past = events.filter(event => new Date(event.startTime) <= now);
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage club events and view RSVPs</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Title</label>
                <input 
                  className="w-full px-3 py-2 border rounded-md" 
                  placeholder="Enter event title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-md" 
                  rows={3}
                  placeholder="Enter event description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <input 
                  className="w-full px-3 py-2 border rounded-md" 
                  placeholder="Enter location..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Create Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} LinkComponent={Link} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} LinkComponent={Link} />
            ))}
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