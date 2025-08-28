"use client";

import { useState, useEffect } from "react";
import { useApiClient, transformEvent, transformRSVP, type Event, type EventRSVP, ApiError } from "../lib/api";

export { type Event, type EventRSVP } from "../lib/api";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  useEffect(() => {
    loadEvents();
  }, [api]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendEvents = await api.events.getAll();
      const transformedEvents = backendEvents.map(transformEvent);
      setEvents(transformedEvents);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to load events";
      setError(errorMessage);
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, "id" | "rsvpCount" | "rsvps">) => {
    try {
      setError(null);
      const backendEvent = await api.events.create(event);
      const newEvent = transformEvent(backendEvent);
      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to create event";
      setError(errorMessage);
      throw err;
    }
  };

  const editEvent = async (id: number, event: Partial<Event>) => {
    try {
      setError(null);
      const backendEvent = await api.events.update(id, event);
      const updatedEvent = transformEvent(backendEvent);
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to update event";
      setError(errorMessage);
      throw err;
    }
  };

  const removeEvent = async (id: number) => {
    try {
      setError(null);
      await api.events.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to delete event";
      setError(errorMessage);
      throw err;
    }
  };

  const getRSVPs = async (eventId: number): Promise<EventRSVP[]> => {
    try {
      setError(null);
      const backendRSVPs = await api.events.getRSVPs(eventId);
      return backendRSVPs.map(transformRSVP);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to load RSVPs";
      setError(errorMessage);
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
