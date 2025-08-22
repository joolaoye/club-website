"use client";

import { useState, useEffect } from 'react';

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

interface UseUpcomingEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export function useUpcomingEvents(): UseUpcomingEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API endpoint
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // For development, set mock data
        setEvents([
          {
            id: '1',
            title: 'React Workshop',
            description: 'Learn the fundamentals of React development',
            startTime: '2024-02-15T18:00:00Z',
            endTime: '2024-02-15T20:00:00Z',
            location: 'Engineering Building, Room 201',
            maxAttendees: 30,
            currentAttendees: 15,
          },
          {
            id: '2',
            title: 'AI/ML Study Group',
            description: 'Weekly study group for machine learning enthusiasts',
            startTime: '2024-02-20T19:00:00Z',
            endTime: '2024-02-20T21:00:00Z',
            location: 'Computer Lab 3',
            currentAttendees: 8,
          },
          {
            id: '3',
            title: 'Hackathon 2024',
            description: 'Annual 48-hour hackathon with amazing prizes',
            startTime: '2024-03-01T18:00:00Z',
            endTime: '2024-03-03T18:00:00Z',
            location: 'Student Center',
            maxAttendees: 100,
            currentAttendees: 45,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
  };
} 