"use client";

import { useState, useEffect } from "react";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishedAt: string;
  status: "published" | "draft";
}

// Mock API functions - replace with actual API calls
const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Welcome to the New Semester!",
    content: "We're excited to kick off another semester of CS Club activities. Our first general meeting will be held this Friday at 6 PM in the Engineering Building. We'll be discussing upcoming events, workshops, and how you can get involved!",
    summary: "First general meeting this Friday at 6 PM in Engineering Building.",
    author: "John Smith",
    publishedAt: "2024-01-15T10:00:00Z",
    status: "published" as const,
  },
  {
    id: 2,
    title: "Hackathon Registration Now Open",
    content: "Our annual hackathon is coming up! Registration is now open for all students. Teams of up to 4 people can participate. Prizes include cash awards and internship opportunities with local tech companies. Register by February 1st to secure your spot.",
    summary: "Annual hackathon registration open until February 1st.",
    author: "Sarah Johnson",
    publishedAt: "2024-01-20T14:30:00Z",
    status: "published" as const,
  },
  {
    id: 3,
    title: "New Officer Applications",
    content: "We're looking for passionate students to join our officer team for the next academic year. Positions available include Vice President, Secretary, and Event Coordinator. Applications are due March 15th.",
    summary: "Officer applications available, due March 15th.",
    author: "Mike Davis",
    publishedAt: "2024-01-25T09:15:00Z",
    status: "draft" as const,
  },
];

const fetchAnnouncements = (): Promise<Announcement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockAnnouncements]), 500);
  });
};

const createAnnouncement = (announcement: Omit<Announcement, "id" | "publishedAt">): Promise<Announcement> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAnnouncement: Announcement = {
        ...announcement,
        id: Date.now(),
        publishedAt: new Date().toISOString(),
      };
      resolve(newAnnouncement);
    }, 500);
  });
};

const updateAnnouncement = (id: number, announcement: Partial<Announcement>): Promise<Announcement> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingAnnouncement = mockAnnouncements.find(a => a.id === id);
      const updatedAnnouncement = { ...existingAnnouncement, ...announcement } as Announcement;
      resolve(updatedAnnouncement);
    }, 500);
  });
};

const deleteAnnouncement = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (announcement: Omit<Announcement, "id" | "publishedAt">) => {
    try {
      const newAnnouncement = await createAnnouncement(announcement);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      return newAnnouncement;
    } catch (err) {
      setError("Failed to create announcement");
      throw err;
    }
  };

  const editAnnouncement = async (id: number, announcement: Partial<Announcement>) => {
    try {
      const updatedAnnouncement = await updateAnnouncement(id, announcement);
      setAnnouncements(prev => prev.map(a => a.id === id ? updatedAnnouncement : a));
      return updatedAnnouncement;
    } catch (err) {
      setError("Failed to update announcement");
      throw err;
    }
  };

  const removeAnnouncement = async (id: number) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError("Failed to delete announcement");
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