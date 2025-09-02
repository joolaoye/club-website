/**
 * Query filter contracts for API operations
 */

export interface EventFilters {
    status?: string[];
    upcoming?: boolean;
    created_by?: number;
    date_from?: string;
    date_to?: string;
    location?: string;
    page?: number;
    limit?: number;
}

export interface AnnouncementFilters {
    pinned?: boolean;
    is_draft?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}

export interface OfficerFilters {
    position?: string;
    page?: number;
    limit?: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}
