"use client";

import { useState, useEffect } from 'react';
import { createPublicClient, type Announcement, ApiError } from '@club-website/api-client';

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
        const client = createPublicClient();
        const data = await client.announcements.getAll();
        setAnnouncements(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch announcements');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const pinnedAnnouncement = announcements.find(a => a.isPinned) || null;

  return { announcements, pinnedAnnouncement, loading, error };
}