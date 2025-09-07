/**
 * API request contracts for Officer operations
 */

export interface CreateOfficerRequest {
    name: string;
    position: string;
    bio?: string;
    image_url?: string;
    order_index?: number;
}

export interface UpdateOfficerRequest {
    name?: string;
    position?: string;
    bio?: string;
    image_url?: string;
    order_index?: number;
}
