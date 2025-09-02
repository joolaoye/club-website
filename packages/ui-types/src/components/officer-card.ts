import type { Officer } from '@club-website/domain-types';

/**
 * Props for the OfficerCard component
 */
export interface OfficerCardProps {
    officer: Officer;
    showActions?: boolean;
    onEdit?: (officer: Officer) => void;
    onDelete?: (officer: Officer) => void;
    className?: string;
}
