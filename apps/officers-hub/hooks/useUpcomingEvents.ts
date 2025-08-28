"use client";

import { useState, useEffect } from 'react';
import { useApiClient, transformEvent, type Event, ApiError } from '../lib/api';

export { type Event } from '../lib/api';

interface UseUpcomingEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export function useUpcomingEvents(): UseUpcomingEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendEvents = await api.events.getAll();
        const transformedEvents = backendEvents.map(transformEvent);
        
        // Filter for upcoming events and sort by start time
        const now = new Date();
        const upcomingEvents = transformedEvents
          .filter((event: Event) => new Date(event.startTime) > now)
          .sort((a: Event, b: Event) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        
        setEvents(upcomingEvents);
      } catch (err) {
        const errorMessage = err instanceof ApiError 
          ? err.message 
          : 'Failed to fetch upcoming events';
        setError(errorMessage);
        console.error("Error loading upcoming events:", err);
        
        // For development, set empty array instead of mock data
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [api]);

  return {
    events,
    loading,
    error,
  };
}
