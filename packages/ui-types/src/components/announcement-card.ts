import type { Announcement } from '@club-website/domain-types';

/**
 * Props for the AnnouncementCard component
 */
export interface AnnouncementCardProps {
    announcement: Announcement;
    showActions?: boolean;
    onEdit?: (announcement: Announcement) => void;
    onDelete?: (announcement: Announcement) => void;
    onPin?: (announcement: Announcement) => void;
    onUnpin?: (announcement: Announcement) => void;
    className?: string;
}
