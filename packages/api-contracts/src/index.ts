// =============================================================================
// API CONTRACTS - Request/Response interfaces
// =============================================================================

// Request contracts
export type {
    CreateEventRequest,
    UpdateEventRequest,
    CreateRSVPRequest
} from './requests/events';

export type {
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest,
    PinAnnouncementRequest
} from './requests/announcements';

export type {
    CreateOfficerRequest,
    UpdateOfficerRequest
} from './requests/officers';

// Response contracts
export type {
    EventResponse,
    EventListResponse,
    RSVPResponse
} from './responses/events';

export type {
    AnnouncementResponse,
    AnnouncementListResponse
} from './responses/announcements';

export type {
    OfficerResponse,
    OfficerListResponse
} from './responses/officers';

// Filters
export type {
    EventFilters,
    AnnouncementFilters,
    OfficerFilters,
    PaginationParams
} from './filters';

// Errors
export { ApiError } from './errors';
export type { ApiErrorResponse } from './errors';
