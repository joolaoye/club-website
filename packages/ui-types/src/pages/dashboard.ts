import type { Event, Announcement, Officer } from '@club-website/domain-types';

/**
 * Dashboard page state
 */
export interface DashboardPageState {
    stats: {
        totalEvents: number;
        upcomingEvents: number;
        totalAnnouncements: number;
        pinnedAnnouncements: number;
        totalOfficers: number;
    };
    recentEvents: Event[];
    recentAnnouncements: Announcement[];
    isLoading: boolean;
    error?: string;
}
