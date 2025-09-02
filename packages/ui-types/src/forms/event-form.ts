import type { CreateEventRequest, UpdateEventRequest } from '@club-website/api-contracts';

/**
 * Form data for creating/editing events
 */
export interface EventFormData {
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    maxAttendees?: number;
}

/**
 * State for event form management
 */
export interface EventFormState {
    data: EventFormData;
    errors: Partial<Record<keyof EventFormData, string>>;
    isSubmitting: boolean;
    isDirty: boolean;
}

/**
 * Convert form data to API request
 */
export function toCreateEventRequest(formData: EventFormData): CreateEventRequest {
    return {
        title: formData.title,
        description: formData.description || undefined,
        location: formData.location || undefined,
        event_date: `${formData.date}T${formData.time}:00Z`,
        max_attendees: formData.maxAttendees
    };
}

/**
 * Convert form data to update request
 */
export function toUpdateEventRequest(formData: Partial<EventFormData>): UpdateEventRequest {
    const request: UpdateEventRequest = {};
    
    if (formData.title !== undefined) request.title = formData.title;
    if (formData.description !== undefined) request.description = formData.description;
    if (formData.location !== undefined) request.location = formData.location;
    if (formData.date && formData.time) {
        request.event_date = `${formData.date}T${formData.time}:00Z`;
    }
    if (formData.maxAttendees !== undefined) request.max_attendees = formData.maxAttendees;
    
    return request;
}
