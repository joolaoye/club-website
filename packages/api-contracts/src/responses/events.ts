/**
 * API response contracts for Event operations
 */

export interface EventResponse {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    event_date: string;
    created_by: {
        id: number;
        full_name: string;
        role: string;
    } | null;
    created_at: string;
    updated_at: string;
    is_upcoming: boolean;
    rsvp_count: number;
    max_attendees: number | null;
    status?: string;
}

export interface EventListResponse {
    events: EventResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface RSVPResponse {
    id: number;
    event_id: number;
    name: string;
    email: string;
    comment: string | null;
    created_at: string;
}
