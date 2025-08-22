import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { Event, transformEvent } from '@/lib/types';

interface UseEventsReturn {
  events: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  loading: boolean;
  error: string | null;
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendEvents = await api.events.getAll();
        
        // Transform backend events to frontend format
        const transformedEvents = backendEvents
          .map(transformEvent)
          .sort((a: Event, b: Event) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        
        setEvents(transformedEvents);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Failed to load events: ${err.message}`);
        } else {
          setError('Failed to load events. Please try again later.');
        }
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events into upcoming and past
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.startTime) > now);
  const pastEvents = events.filter(event => new Date(event.startTime) <= now).reverse(); // Most recent first

  return {
    events,
    upcomingEvents,
    pastEvents,
    loading,
    error,
  };
} 