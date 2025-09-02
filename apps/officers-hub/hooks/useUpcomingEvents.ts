"use client";

import { useState, useEffect } from "react";
import { useApiClient, type Event, ApiError } from "../lib/api";

export function useUpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  useEffect(() => {
    loadUpcomingEvents();
  }, [api]);

  const loadUpcomingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allEvents = await api.events.getAll();
      
      // Filter for upcoming events only
      const now = new Date();
      const upcomingEvents = allEvents
        .filter(event => event.scheduledAt > now)
        .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
      
      setEvents(upcomingEvents);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to load events";
      setError(errorMessage);
      console.error("Error loading upcoming events:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    refetch: loadUpcomingEvents,
  };
}