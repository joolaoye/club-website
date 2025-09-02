// =============================================================================
// BACKEND API RESPONSE TYPES
// These match exactly what the Django API returns
// =============================================================================

export interface User {
    id: number;
    full_name: string;
    role: string;
    email?: string;
  }
  
  export interface Event {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    event_date: string; // ISO datetime string
    created_by: User | null;
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
    is_upcoming: boolean;
    rsvp_count: number;
  }
  
  export interface Announcement {
    id: number;
    content: string;
    display_text?: string | null;
    pinned: boolean;
    is_draft: boolean;
    discord_message_id?: string | null;
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
  }
  
  export interface Officer {
    id: number;
    user: User;
    name: string;
    full_name: string;
    user_email: string;
    position: string;
    bio: string | null;
    image_url: string | null;
    linkedin_url: string | null;
    email: string | null;
    order_index: number;
  }
  
  export interface RSVP {
    id: number;
    event_id: number;
    name: string;
    email: string;
    comment: string | null;
    created_at: string; // ISO datetime string
  }
  
  // =============================================================================
  // API REQUEST/RESPONSE WRAPPERS
  // =============================================================================
  
  export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }
  
  export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  }
  
  export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, any>;
  }