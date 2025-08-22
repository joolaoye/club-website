import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { Event, transformEvent } from '@/lib/types';

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
        
        const backendEvents = await api.events.getAll();
        
        // Transform backend events to frontend format and filter upcoming
        const now = new Date();
        const upcomingEvents = backendEvents
          .filter((event) => event.is_upcoming && new Date(event.event_date) > now)
          .map(transformEvent)
          .sort((a: Event, b: Event) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        
        setEvents(upcomingEvents);
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

  return {
    events,
    loading,
    error,
  };
} 