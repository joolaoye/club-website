"use client";

import { useState, useEffect } from "react";

export interface EventRSVP {
  id: number;
  name: string;
  email: string;
  timestamp: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  status: "upcoming" | "past";
  rsvps: EventRSVP[];
}

// Mock API functions - replace with actual API calls
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Tech Talk: AI in Web Development",
    description: "Join us for an exciting presentation on how AI is revolutionizing web development.",
    date: "2024-02-15",
    time: "18:00",
    location: "Engineering Building, Room 201",
    rsvpCount: 23,
    status: "upcoming" as const,
    rsvps: [
      { id: 1, name: "John Doe", email: "john@example.com", timestamp: "2024-01-20T10:00:00Z" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", timestamp: "2024-01-21T14:30:00Z" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", timestamp: "2024-01-22T09:15:00Z" },
    ]
  },
  {
    id: 2,
    title: "Coding Bootcamp",
    description: "A hands-on coding session for beginners. Learn the basics of programming.",
    date: "2024-02-22",
    time: "14:00",
    location: "Computer Lab 1",
    rsvpCount: 15,
    status: "upcoming" as const,
    rsvps: [
      { id: 4, name: "Alice Brown", email: "alice@example.com", timestamp: "2024-01-23T16:45:00Z" },
      { id: 5, name: "Charlie Davis", email: "charlie@example.com", timestamp: "2024-01-24T11:20:00Z" },
    ]
  },
];

const fetchEvents = (): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockEvents), 500);
  });
};

const createEvent = (event: Omit<Event, "id" | "rsvpCount" | "rsvps">): Promise<Event> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent: Event = {
        ...event,
        id: Date.now(),
        rsvpCount: 0,
        rsvps: [],
      };
      resolve(newEvent);
    }, 500);
  });
};

const updateEvent = (id: number, event: Partial<Event>): Promise<Event> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingEvent = mockEvents.find(e => e.id === id);
      const updatedEvent = { ...existingEvent, ...event } as Event;
      resolve(updatedEvent);
    }, 500);
  });
};

const deleteEvent = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};

const getEventRSVPs = (eventId: number): Promise<EventRSVP[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find(e => e.id === eventId);
      resolve(event?.rsvps || []);
    }, 300);
  });
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, "id" | "rsvpCount" | "rsvps">) => {
    try {
      const newEvent = await createEvent(event);
      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      setError("Failed to create event");
      throw err;
    }
  };

  const editEvent = async (id: number, event: Partial<Event>) => {
    try {
      const updatedEvent = await updateEvent(id, event);
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
      return updatedEvent;
    } catch (err) {
      setError("Failed to update event");
      throw err;
    }
  };

  const removeEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError("Failed to delete event");
      throw err;
    }
  };

  const getRSVPs = async (eventId: number) => {
    try {
      return await getEventRSVPs(eventId);
    } catch (err) {
      setError("Failed to load RSVPs");
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    addEvent,
    editEvent,
    removeEvent,
    getRSVPs,
    refetch: loadEvents,
  };
} 