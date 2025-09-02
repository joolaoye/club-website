import type { Event, RSVP } from '@club-website/domain-types';
import { EventStatus } from '@club-website/domain-types';
import type { EventResponse, RSVPResponse } from '@club-website/api-contracts';

/**
 * Transform API event response to domain entity
 */
export function transformEventResponse(response: EventResponse): Event {
    return {
        id: response.id.toString(),
        title: response.title,
        description: response.description || '',
        location: response.location || '',
        scheduledAt: new Date(response.event_date),
        createdBy: response.created_by ? {
            id: response.created_by.id.toString(),
            name: response.created_by.full_name,
            role: response.created_by.role
        } : null,
        rsvpCount: response.rsvp_count,
        maxAttendees: response.max_attendees || undefined,
        isUpcoming: response.is_upcoming,
        status: mapEventStatus(response.status),
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at)
    };
}

/**
 * Transform API RSVP response to domain entity
 */
export function transformRSVPResponse(response: RSVPResponse): RSVP {
    return {
        id: response.id.toString(),
        eventId: response.event_id.toString(),
        name: response.name,
        email: response.email,
        comment: response.comment || undefined,
        registeredAt: new Date(response.created_at)
    };
}

/**
 * Map API status string to domain enum
 */
function mapEventStatus(status?: string): EventStatus {
    if (!status) return EventStatus.UPCOMING;
    
    switch (status.toLowerCase()) {
        case 'upcoming':
            return EventStatus.UPCOMING;
        case 'past':
            return EventStatus.PAST;
        case 'ongoing':
            return EventStatus.ONGOING;
        default:
            return EventStatus.UPCOMING;
    }
}
