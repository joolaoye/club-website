// =============================================================================
// API CLIENT - Clean CRUD interface
// =============================================================================

import { HttpTransport } from './transport/http-transport';
import { EventsResource } from './resources/events';
import { AnnouncementsResource } from './resources/announcements';
import { OfficersResource } from './resources/officers';

export class ClubApiClient {
    readonly events: EventsResource;
    readonly announcements: AnnouncementsResource;
    readonly officers: OfficersResource;

    constructor(private transport: HttpTransport) {
        this.events = new EventsResource(transport);
        this.announcements = new AnnouncementsResource(transport);
        this.officers = new OfficersResource(transport);
    }
}

/**
 * Create a public API client (no authentication)
 */
export function createPublicClient(baseUrl?: string): ClubApiClient {
    const transport = new HttpTransport({ baseUrl });
    return new ClubApiClient(transport);
}

/**
 * Create an authenticated API client
 */
export function createAuthenticatedClient(
    getToken: () => Promise<string | null>,
    baseUrl?: string
): ClubApiClient {
    const transport = new HttpTransport({ baseUrl, getToken });
    return new ClubApiClient(transport);
}

// Re-export types that consumers need
export type { 
    Event, 
    Announcement, 
    Officer, 
    RSVP
} from '@club-website/domain-types';

export type { 
    CreateEventRequest,
    UpdateEventRequest,
    CreateRSVPRequest,
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest,
    CreateOfficerRequest,
    UpdateOfficerRequest,
    EventFilters,
    AnnouncementFilters,
    OfficerFilters,
    PaginationParams
} from '@club-website/api-contracts';

export { ApiError } from '@club-website/api-contracts';