"use client";

import { useState, useEffect } from "react";

export interface Officer {
  id: number;
  name: string;
  title: string;
  email: string;
  bio: string;
  photoUrl: string;
  joinedAt: string;
  isActive: boolean;
}

// Mock API functions - replace with actual API calls
const mockOfficers: Officer[] = [
  {
    id: 1,
    name: "John Smith",
    title: "President",
    email: "john@university.edu",
    bio: "John is a senior Computer Science major with a passion for full-stack development and machine learning. He has led multiple successful hackathons and internships at tech companies.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2023-08-01",
    isActive: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Vice President",
    email: "sarah@university.edu",
    bio: "Sarah is passionate about cybersecurity and AI. She organizes our technical workshops and maintains our club's infrastructure. When not coding, she enjoys rock climbing.",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2023-08-01",
    isActive: true,
  },
  {
    id: 3,
    name: "Mike Davis",
    title: "Secretary",
    email: "mike@university.edu",
    bio: "Mike handles all our communication and documentation. He's studying Software Engineering and is particularly interested in DevOps and cloud computing.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2023-09-15",
    isActive: true,
  },
  {
    id: 4,
    name: "Emily Chen",
    title: "Event Coordinator",
    email: "emily@university.edu",
    bio: "Emily plans and executes all our events, from small study groups to large hackathons. She's majoring in Computer Science with a minor in Business Administration.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2024-01-10",
    isActive: false,
  },
];

const fetchOfficers = (): Promise<Officer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockOfficers]), 500);
  });
};

const createOfficer = (officer: Omit<Officer, "id" | "joinedAt">): Promise<Officer> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOfficer: Officer = {
        ...officer,
        id: Date.now(),
        joinedAt: new Date().toISOString(),
      };
      resolve(newOfficer);
    }, 500);
  });
};

const updateOfficer = (id: number, officer: Partial<Officer>): Promise<Officer> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingOfficer = mockOfficers.find(o => o.id === id);
      const updatedOfficer = { ...existingOfficer, ...officer } as Officer;
      resolve(updatedOfficer);
    }, 500);
  });
};

const deleteOfficer = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};

export function useOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      setLoading(true);
      const data = await fetchOfficers();
      setOfficers(data);
    } catch (err) {
      setError("Failed to load officers");
    } finally {
      setLoading(false);
    }
  };

  const addOfficer = async (officer: Omit<Officer, "id" | "joinedAt">) => {
    try {
      const newOfficer = await createOfficer(officer);
      setOfficers(prev => [...prev, newOfficer]);
      return newOfficer;
    } catch (err) {
      setError("Failed to create officer");
      throw err;
    }
  };

  const editOfficer = async (id: number, officer: Partial<Officer>) => {
    try {
      const updatedOfficer = await updateOfficer(id, officer);
      setOfficers(prev => prev.map(o => o.id === id ? updatedOfficer : o));
      return updatedOfficer;
    } catch (err) {
      setError("Failed to update officer");
      throw err;
    }
  };

  const removeOfficer = async (id: number) => {
    try {
      await deleteOfficer(id);
      setOfficers(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      setError("Failed to delete officer");
      throw err;
    }
  };

  const toggleOfficerStatus = async (id: number) => {
    const officer = officers.find(o => o.id === id);
    if (officer) {
      return editOfficer(id, { isActive: !officer.isActive });
    }
  };

  const activeOfficers = officers.filter(o => o.isActive);
  const inactiveOfficers = officers.filter(o => !o.isActive);

  return {
    officers,
    activeOfficers,
    inactiveOfficers,
    loading,
    error,
    addOfficer,
    editOfficer,
    removeOfficer,
    toggleOfficerStatus,
    refetch: loadOfficers,
  };
} 