"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { EventPreviewOfficersHub } from "@club-website/ui/components/events/EventPreviewOfficersHub";
import { useEvents } from "@/hooks/useEvents";
import { useApiClient } from "@/lib/api";
import { toEventUIProps } from "@/lib/adapters";
import { Skeleton } from "@club-website/ui/components/skeleton";
import { AlertCircle } from "lucide-react";

interface EventPreviewWrapperProps {
  eventId: string;
  onBack: () => void;
  onEdit: (eventId: string) => void;
}

export default function EventPreviewWrapper({ 
  eventId, 
  onBack, 
  onEdit 
}: EventPreviewWrapperProps) {
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedEventIdRef = useRef<string | null>(null);
  
  const { events, getEventById } = useEvents();
  const api = useApiClient();

  // Memoize the apiClient to prevent recreation on every render
  const apiClient = useMemo(() => ({
    getRSVPs: async (eventId: string) => {
      try {
        return await api.events.getRSVPs(eventId);
      } catch (error) {
        console.error('Failed to load RSVPs:', error);
        return [];
      }
    }
  }), [api.events]);

  // Load event data when eventId changes
  useEffect(() => {
    if (!eventId) return;
    
    // Reset state when eventId changes
    if (loadedEventIdRef.current !== eventId) {
      setEvent(null);
      setError(null);
      loadedEventIdRef.current = eventId;
    }

    const loadEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simple API call without complex caching logic
        const eventData = await getEventById(eventId);
        if (eventData) {
          const uiProps = toEventUIProps(eventData);
          setEvent(uiProps);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Failed to load event:', err);
        setError('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId]); // Only depend on eventId

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {error || 'Event not found'}
        </h3>
        <p className="text-muted-foreground mb-4">
          The event you're looking for could not be loaded.
        </p>
        <button 
          onClick={onBack}
          className="text-primary hover:underline"
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <EventPreviewOfficersHub
      event={event}
      apiClient={apiClient}
      onBack={onBack}
      onEdit={onEdit}
    />
  );
}
