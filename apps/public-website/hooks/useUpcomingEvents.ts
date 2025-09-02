import { useState, useEffect } from 'react';
import { createPublicClient, type Event, ApiError } from '@club-website/api-client';

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
        
        const client = createPublicClient();
        const events = await client.events.getAll();
        
        // Filter upcoming events
        const now = new Date();
        const upcomingEvents = events
          .filter((event: Event) => event.scheduledAt > now)
          .sort((a: Event, b: Event) => 
            a.scheduledAt.getTime() - b.scheduledAt.getTime()
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

  return { events, loading, error };
} 