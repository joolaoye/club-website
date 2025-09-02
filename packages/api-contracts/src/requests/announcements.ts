/**
 * API request contracts for Announcement operations
 */

export interface CreateAnnouncementRequest {
    content: string;
    display_text?: string;
    pinned?: boolean;
    is_draft?: boolean;
}

export interface UpdateAnnouncementRequest {
    content?: string;
    display_text?: string;
    pinned?: boolean;
    is_draft?: boolean;
}

export interface PinAnnouncementRequest {
    display_text: string;
}
