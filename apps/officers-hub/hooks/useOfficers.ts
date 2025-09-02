"use client";

import { useState, useEffect, useCallback } from "react";
import { useApiClient, type Officer, ApiError } from "../lib/api";
import { 
  toCreateOfficerRequest, 
  toUpdateOfficerRequest,
  toOfficerUIProps 
} from "../lib/adapters";

export function useOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  const loadOfficers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const officers = await api.officers.getAll();
      setOfficers(officers);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to load officers";
      setError(errorMessage);
      console.error("Error loading officers:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadOfficers();
  }, [loadOfficers]);

  const addOfficer = useCallback(async (officerData: {
    name: string;
    position: string;
    bio?: string;
    imageUrl?: string;
    linkedinUrl?: string;
    email?: string;
    orderIndex?: number;
  }) => {
    try {
      setError(null);
      const request = toCreateOfficerRequest(officerData);
      const officer = await api.officers.create(request);
      setOfficers(prev => [...prev, officer]);
      return officer;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to create officer";
      setError(errorMessage);
      throw err;
    }
  }, [api]);

  const editOfficer = useCallback(async (id: string, officerData: Partial<{
    name: string;
    position: string;
    bio?: string;
    imageUrl?: string;
    linkedinUrl?: string;
    email?: string;
    orderIndex?: number;
  }>) => {
    try {
      setError(null);
      const request = toUpdateOfficerRequest(officerData);
      const officer = await api.officers.update(id, request);
      setOfficers(prev => prev.map(o => o.id === id ? officer : o));
      return officer;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to update officer";
      setError(errorMessage);
      throw err;
    }
  }, [api]);

  const removeOfficer = useCallback(async (id: string) => {
    try {
      setError(null);
      await api.officers.delete(id);
      setOfficers(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to delete officer";
      setError(errorMessage);
      throw err;
    }
  }, [api]);

  return {
    officers,
    loading,
    error,
    addOfficer,
    editOfficer,
    removeOfficer,
    refetch: loadOfficers,
  };
}