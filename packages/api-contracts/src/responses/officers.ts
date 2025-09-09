/**
 * API response contracts for Officer operations
 */

export interface OfficerResponse {
    id: number;
    name: string;
    position: string;
    bio: string | null;
    image_url: string | null;
    order_index: number;
    user?: {
        id: number;
        full_name: string;
        email: string;
    };
}

export interface OfficerListResponse {
    officers: OfficerResponse[];
    total: number;
}
