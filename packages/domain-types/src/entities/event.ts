import type { EventStatus } from '../enums/event';

/**
 * Core Event entity representing a club event
 */
export interface Event {
    readonly id: string;
    readonly title: string;
    readonly description: string | null;
    readonly location: string | null;
    
    // New timestamp fields
    readonly startAt: Date;
    readonly endAt: Date;
    
    // URL fields (no rsvpLink as RSVPs are handled internally)
    readonly meetingLink: string | null;
    readonly slidesUrl: string | null;
    readonly recordingUrl: string | null;
    
    readonly createdBy: CreatedBy | null;
    readonly rsvpCount: number;
    readonly maxAttendees?: number;
    
    // Computed status fields
    readonly status: EventStatus;
    readonly isUpcoming: boolean;
    readonly isOngoing: boolean;
    readonly isPast: boolean;
    readonly canRsvp: boolean;
    readonly editableFields: string[];
    
    readonly createdAt: Date;
    readonly updatedAt: Date;
    
    // Legacy field for backward compatibility
    readonly scheduledAt: Date; // Maps to startAt
  }
  
  export interface CreatedBy {
    readonly id: string;
    readonly name: string;
    readonly role: string;
  }
  
