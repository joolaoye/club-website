import { BackendEvent, BackendAnnouncement, BackendOfficer } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error - please check your connection and try again',
      0
    );
  }
}

export const api = {
  // Events
  events: {
    getAll: () => apiRequest<BackendEvent[]>('/events/'),
    getById: (id: string) => apiRequest<BackendEvent>(`/events/${id}/`),
    rsvp: (id: string, data: { name: string; email: string; comment?: string }) => 
      apiRequest<any>(`/events/${id}/rsvp/`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Announcements
  announcements: {
    getAll: () => apiRequest<BackendAnnouncement[]>('/announcements/'),
  },

  // Officers
  officers: {
    getAll: () => apiRequest<BackendOfficer[]>('/officers/'),
  },

  // Highlights
  highlights: {
    getAll: () => apiRequest<any[]>('/highlights/'),
  },
};

export { ApiError };
export default api; 