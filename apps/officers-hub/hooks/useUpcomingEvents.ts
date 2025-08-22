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
        const response = await fetch('/api/events/upcoming');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Filter for upcoming events and sort by start time
        const now = new Date();
        const upcomingEvents = data
          .filter((event: Event) => new Date(event.startTime) > now)
          .sort((a: Event, b: Event) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        
        setEvents(upcomingEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // For development, set mock data
        setEvents([
          {
            id: '1',
            title: 'Tech Talk: Introduction to Machine Learning',
            description: 'Join us for an introductory session on machine learning fundamentals.',
            startTime: '2024-07-25T18:00:00Z',
            endTime: '2024-07-25T19:30:00Z',
            location: 'Computer Science Building, Room 200',
            maxAttendees: 50,
            currentAttendees: 23,
          },
          {
            id: '2',
            title: 'Coding Workshop: Web Development Basics',
            description: 'Learn the basics of HTML, CSS, and JavaScript in this hands-on workshop.',
            startTime: '2024-07-30T16:00:00Z',
            endTime: '2024-07-30T18:00:00Z',
            location: 'CS Lab 1',
            currentAttendees: 15,
          }
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