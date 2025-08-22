"use client";

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { Announcement, transformAnnouncement } from '@/lib/types';

interface UseAnnouncementsReturn {
  announcements: Announcement[];
  pinnedAnnouncement: Announcement | null;
  loading: boolean;
  error: string | null;
}

export function useAnnouncements(): UseAnnouncementsReturn {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendAnnouncements = await api.announcements.getAll();
        
        // Transform backend announcements to frontend format
        const transformedAnnouncements = backendAnnouncements.map(transformAnnouncement);
        
        setAnnouncements(transformedAnnouncements);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Failed to load announcements: ${err.message}`);
        } else {
          setError('Failed to load announcements. Please try again later.');
        }
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const pinnedAnnouncement = announcements.find(announcement => announcement.isPinned) || null;

  return {
    announcements,
    pinnedAnnouncement,
    loading,
    error,
  };
} 