"use client";

import { useState, useEffect } from "react";
import { useApiClient, type Announcement, ApiError } from "../lib/api";
import { 
  toCreateAnnouncementRequest, 
  toUpdateAnnouncementRequest,
  toAnnouncementUIProps 
} from "../lib/adapters";

export { type Announcement } from "../lib/api";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  useEffect(() => {
    loadAnnouncements();
  }, [api]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const announcements = await api.announcements.getAllAdmin();
      setAnnouncements(announcements);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to load announcements";
      setError(errorMessage);
      console.error("Error loading announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (data: {
    content: string;
    displayText?: string;
    isPinned?: boolean;
    isDraft?: boolean;
  }) => {
    try {
      setError(null);
      const request = toCreateAnnouncementRequest(data);
      const announcement = await api.announcements.create(request);
      setAnnouncements(prev => [...prev, announcement]);
      return announcement;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to create announcement";
      setError(errorMessage);
      throw err;
    }
  };

  const editAnnouncement = async (id: string, data: Partial<{
    content: string;
    displayText?: string;
    isPinned?: boolean;
    isDraft?: boolean;
  }>) => {
    try {
      setError(null);
      const request = toUpdateAnnouncementRequest(data);
      const announcement = await api.announcements.update(id, request);
      setAnnouncements(prev => prev.map(a => a.id === id ? announcement : a));
      return announcement;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to update announcement";
      setError(errorMessage);
      throw err;
    }
  };

  const removeAnnouncement = async (id: string) => {
    try {
      setError(null);
      await api.announcements.delete(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to delete announcement";
      setError(errorMessage);
      throw err;
    }
  };

  const pinAnnouncement = async (id: string, displayText: string) => {
    try {
      setError(null);
      const announcement = await api.announcements.pin(id, displayText);
      setAnnouncements(prev => prev.map(a => a.id === id ? announcement : a));
      return announcement;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to pin announcement";
      setError(errorMessage);
      throw err;
    }
  };

  const unpinAnnouncement = async (id: string) => {
    try {
      setError(null);
      const announcement = await api.announcements.unpin(id);
      setAnnouncements(prev => prev.map(a => a.id === id ? announcement : a));
      return announcement;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to unpin announcement";
      setError(errorMessage);
      throw err;
    }
  };

  return {
    announcements,
    loading,
    error,
    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    pinAnnouncement,
    unpinAnnouncement,
    refetch: loadAnnouncements,
  };
}