import type { EventStatus } from '../enums/event';

/**
 * Core Event entity representing a club event
 */
export interface Event {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly location: string;
    readonly scheduledAt: Date;
    readonly createdBy: CreatedBy | null;
    readonly rsvpCount: number;
    readonly maxAttendees?: number;
    readonly isUpcoming: boolean;
    readonly status: EventStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }
  
  export interface CreatedBy {
    readonly id: string;
    readonly name: string;
    readonly role: string;
  }
  
