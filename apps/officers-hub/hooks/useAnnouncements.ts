"use client";

import { useState, useEffect } from "react";
import { useApiClient, transformAnnouncement, type Announcement, ApiError } from "../lib/api";

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
      const backendAnnouncements = await api.announcements.getAll();
      const transformedAnnouncements = backendAnnouncements.map(transformAnnouncement);
      setAnnouncements(transformedAnnouncements);
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

  const addAnnouncement = async (announcement: Omit<Announcement, "id" | "publishedAt">) => {
    try {
      setError(null);
      const backendAnnouncement = await api.announcements.create(announcement);
      const newAnnouncement = transformAnnouncement(backendAnnouncement);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      return newAnnouncement;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to create announcement";
      setError(errorMessage);
      throw err;
    }
  };

  const editAnnouncement = async (id: number, announcement: Partial<Announcement>) => {
    try {
      setError(null);
      const backendAnnouncement = await api.announcements.update(id, announcement);
      const updatedAnnouncement = transformAnnouncement(backendAnnouncement);
      setAnnouncements(prev => prev.map(a => a.id === id ? updatedAnnouncement : a));
      return updatedAnnouncement;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to update announcement";
      setError(errorMessage);
      throw err;
    }
  };

  const removeAnnouncement = async (id: number) => {
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

  const publishedAnnouncements = announcements.filter(a => a.status === "published");
  const draftAnnouncements = announcements.filter(a => a.status === "draft");

  return {
    announcements,
    publishedAnnouncements,
    draftAnnouncements,
    loading,
    error,
    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    refetch: loadAnnouncements,
  };
}
