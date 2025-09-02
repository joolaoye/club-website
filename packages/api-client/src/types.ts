// =============================================================================
// INTERNAL API TYPES
// These match Django API responses exactly - NOT exported to frontend
// =============================================================================

export interface ApiUser {
    id: number;
    full_name: string;
    role: string;
    email?: string;
  }
  
  export interface ApiEvent {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    event_date: string; // ISO datetime string
    created_by: ApiUser | null;
    created_at: string;
    updated_at: string;
    is_upcoming: boolean;
    rsvp_count: number;
  }
  
  export interface ApiAnnouncement {
    id: number;
    content: string;
    display_text?: string | null;
    pinned: boolean;
    is_draft: boolean;
    discord_message_id?: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface ApiOfficer {
    id: number;
    user: ApiUser;
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
  
  export interface ApiRSVP {
    id: number;
    event_id: number;
    name: string;
    email: string;
    comment: string | null;
    created_at: string;
  }
  
  // API Error Response
  export interface ApiErrorResponse {
    error?: string;
    detail?: string;
    message?: string;
    [key: string]: any;
  }