import type { Event, RSVP } from '@club-website/domain-types';
import { EventStatus } from '@club-website/domain-types';
import type { EventResponse, RSVPResponse, CreateEventRequest, UpdateEventRequest } from '@club-website/api-contracts';

/**
 * Transform API event response to domain entity
 */
export function transformEventResponse(response: EventResponse): Event {
    return {
        id: response.id.toString(),
        title: response.title,
        description: response.description,
        location: response.location,
        startAt: new Date(response.start_at),
        endAt: new Date(response.end_at),
        meetingLink: response.meeting_link,
        slidesUrl: response.slides_url,
        recordingUrl: response.recording_url,
        createdBy: response.created_by ? {
            id: response.created_by.id.toString(),
            name: response.created_by.full_name,
            role: response.created_by.role
        } : null,
        rsvpCount: response.rsvp_count,
        maxAttendees: undefined, // Not in new schema
        status: response.status as EventStatus,
        isUpcoming: response.is_upcoming,
        isOngoing: response.is_ongoing,
        isPast: response.is_past,
        canRsvp: response.can_rsvp,
        editableFields: response.editable_fields,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
        // Legacy compatibility
        scheduledAt: new Date(response.start_at),
    };
}

/**
 * Transform API RSVP response to domain entity
 */
export function transformRSVPResponse(response: RSVPResponse): RSVP {
    return {
        id: response.id.toString(),
        eventId: response.event.toString(),
        name: response.name,
        email: response.email,
        comment: response.comment || undefined,
        registeredAt: new Date(response.created_at)
    };
}

/**
 * Transform event creation data to API request
 */
export function toCreateEventRequest(data: {
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    meetingLink?: string;
    slidesUrl?: string;
    recordingUrl?: string;
}): CreateEventRequest {
    return {
        title: data.title,
        description: data.description || undefined,
        location: data.location || undefined,
        start_at: data.startTime,
        end_at: data.endTime,
        meeting_link: data.meetingLink || undefined,
        slides_url: data.slidesUrl || undefined,
        recording_url: data.recordingUrl || undefined,
    };
}

/**
 * Transform event update data to API request
 */
export function toUpdateEventRequest(data: Partial<{
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    meetingLink: string;
    slidesUrl: string;
    recordingUrl: string;
}>): UpdateEventRequest {
    const request: UpdateEventRequest = {};
    
    if (data.title !== undefined) request.title = data.title;
    if (data.description !== undefined) request.description = data.description;
    if (data.location !== undefined) request.location = data.location;
    if (data.startTime !== undefined) request.start_at = data.startTime;
    if (data.endTime !== undefined) request.end_at = data.endTime;
    if (data.meetingLink !== undefined) request.meeting_link = data.meetingLink;
    if (data.slidesUrl !== undefined) request.slides_url = data.slidesUrl;
    if (data.recordingUrl !== undefined) request.recording_url = data.recordingUrl;
    
    return request;
}