/**
 * API response contracts for Event operations
 */

export interface EventResponse {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    
    // New timestamp fields
    start_at: string;
    end_at: string;
    
    // URL fields (no rsvp_link as RSVPs are handled internally)
    meeting_link: string | null;
    slides_url: string | null;
    recording_url: string | null;
    
    created_by: {
        id: number;
        full_name: string;
        role: string;
    } | null;
    created_at: string;
    updated_at: string;
    
    // Computed fields
    status: 'upcoming' | 'ongoing' | 'past';
    is_upcoming: boolean;
    is_ongoing: boolean;
    is_past: boolean;
    can_rsvp: boolean;
    rsvp_count: number;
    editable_fields: string[];
    
    // Legacy field for backward compatibility
    event_date: string;
}

export interface EventListResponse {
    events: EventResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface RSVPResponse {
    id: number;
    event: number;
    event_title: string;
    event_date: string;
    name: string;
    email: string;
    comment: string | null;
    created_at: string;
}
