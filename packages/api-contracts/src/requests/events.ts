/**
 * API request contracts for Event operations
 */

export interface CreateEventRequest {
    title: string;
    description?: string;
    location?: string;
    start_at: string; // ISO date string
    end_at: string; // ISO date string
    meeting_link?: string;
    slides_url?: string;
    recording_url?: string;
}

export interface UpdateEventRequest {
    title?: string;
    description?: string;
    location?: string;
    start_at?: string;
    end_at?: string;
    meeting_link?: string;
    slides_url?: string;
    recording_url?: string;
}

export interface CreateRSVPRequest {
    name: string;
    email: string;
    comment?: string;
}
