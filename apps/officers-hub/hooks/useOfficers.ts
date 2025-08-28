"use client";

import { useState, useEffect } from "react";
import { useApiClient, transformOfficer, type Officer, ApiError } from "../lib/api";

export { type Officer } from "../lib/api";

export function useOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  useEffect(() => {
    loadOfficers();
  }, [api]);

  const loadOfficers = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendOfficers = await api.officers.getAll();
      const transformedOfficers = backendOfficers.map(transformOfficer);
      setOfficers(transformedOfficers);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to load officers";
      setError(errorMessage);
      console.error("Error loading officers:", err);
    } finally {
      setLoading(false);
    }
  };

  const addOfficer = async (officer: Omit<Officer, "id" | "joinedAt">) => {
    try {
      setError(null);
      const backendOfficer = await api.officers.create(officer);
      const newOfficer = transformOfficer(backendOfficer);
      setOfficers(prev => [...prev, newOfficer]);
      return newOfficer;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to create officer";
      setError(errorMessage);
      throw err;
    }
  };

  const editOfficer = async (id: number, officer: Partial<Officer>) => {
    try {
      setError(null);
      const backendOfficer = await api.officers.update(id, officer);
      const updatedOfficer = transformOfficer(backendOfficer);
      setOfficers(prev => prev.map(o => o.id === id ? updatedOfficer : o));
      return updatedOfficer;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : "Failed to update officer";
      setError(errorMessage);
      throw err;
    }
  };

  const removeOfficer = async (id: number) => {
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
