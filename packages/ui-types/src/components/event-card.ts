import type { Event } from '@club-website/domain-types';

/**
 * Props for the EventCard component
 */
export interface EventCardProps {
    event: Event;
    showActions?: boolean;
    onEdit?: (event: Event) => void;
    onDelete?: (event: Event) => void;
    onRSVP?: (event: Event) => void;
    className?: string;
}
