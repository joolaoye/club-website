import { createAuthenticatedClient, ApiError } from '@club-website/api-client';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

// Re-export types from domain-types
export type {
  Event,
  Announcement,
  Officer,
  RSVP as EventRSVP
} from '@club-website/domain-types';

// Re-export API types we need
export type {
  CreateEventRequest,
  UpdateEventRequest,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  CreateOfficerRequest,
  UpdateOfficerRequest
} from '@club-website/api-contracts';

export { ApiError };

export function useApiClient() {
  const { getToken } = useAuth();
  
  return useMemo(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    return createAuthenticatedClient(
      () => getToken({ template: 'backend' }),
      apiBaseUrl
    );
  }, [getToken]);
}