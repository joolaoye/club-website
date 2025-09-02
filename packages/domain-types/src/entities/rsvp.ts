/**
 * RSVP entity for event registrations
 */
export interface RSVP {
    readonly id: string;
    readonly eventId: string;
    readonly name: string;
    readonly email: string;
    readonly comment?: string;
    readonly registeredAt: Date;
  }