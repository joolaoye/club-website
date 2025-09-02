import type { Announcement } from '@club-website/domain-types';
import type { AnnouncementResponse } from '@club-website/api-contracts';

/**
 * Transform API announcement response to domain entity
 */
export function transformAnnouncementResponse(response: AnnouncementResponse): Announcement {
    return {
        id: response.id.toString(),
        content: response.content,
        displayText: response.display_text || undefined,
        isPinned: response.pinned,
        isDraft: response.is_draft,
        discordMessageId: response.discord_message_id || undefined,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at)
    };
}
