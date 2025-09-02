/**
 * API request contracts for Event operations
 */

export interface CreateEventRequest {
    title: string;
    description?: string;
    location?: string;
    event_date: string; // ISO date string
    max_attendees?: number;
}

export interface UpdateEventRequest {
    title?: string;
    description?: string;
    location?: string;
    event_date?: string;
    max_attendees?: number;
    status?: string;
}

export interface CreateRSVPRequest {
    name: string;
    email: string;
    comment?: string;
}
