/**
 * API response contracts for Announcement operations
 */

export interface AnnouncementResponse {
    id: number;
    content: string;
    display_text: string | null;
    pinned: boolean;
    is_draft: boolean;
    discord_message_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface AnnouncementListResponse {
    announcements: AnnouncementResponse[];
    total: number;
    page: number;
    limit: number;
}
