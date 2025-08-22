"use client";

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { Officer, transformOfficer } from '@/lib/types';

interface UseOfficersReturn {
  officers: Officer[];
  loading: boolean;
  error: string | null;
}

export function useOfficers(): UseOfficersReturn {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendOfficers = await api.officers.getAll();
        
        // Transform backend officers to frontend format and sort by order_index
        const transformedOfficers = backendOfficers
          .sort((a, b) => a.order_index - b.order_index)
          .map(transformOfficer);
        
        setOfficers(transformedOfficers);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`Failed to load officers: ${err.message}`);
        } else {
          setError('Failed to load officers. Please try again later.');
        }
        setOfficers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  return {
    officers,
    loading,
    error,
  };
} 