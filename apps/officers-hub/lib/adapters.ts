/**
 * Adapter functions to transform domain types to UI component props
 */

import type { Event, Announcement, Officer, RSVP } from '@club-website/domain-types';

/**
 * Transform domain Event to UI component props
 */
export function toEventUIProps(event: Event) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.scheduledAt.toISOString(),
    endTime: event.scheduledAt.toISOString(), // Using same time since we don't have endTime
    location: event.location,
    maxAttendees: event.maxAttendees,
    currentAttendees: event.rsvpCount,
    createdBy: event.createdBy,
    isUpcoming: event.isUpcoming,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

/**
 * Transform domain Announcement to UI component props
 */
export function toAnnouncementUIProps(announcement: Announcement) {
  return {
    id: announcement.id,
    content: announcement.content,
    displayText: announcement.displayText,
    isPinned: announcement.isPinned,
    isDraft: announcement.isDraft,
    discordMessageId: announcement.discordMessageId,
    summary: announcement.content.length <= 150 
      ? announcement.content 
      : announcement.content.substring(0, 147) + '...',
    createdAt: announcement.createdAt.toISOString(),
    updatedAt: announcement.updatedAt.toISOString(),
  };
}

/**
 * Transform domain Officer to UI component props
 */
export function toOfficerUIProps(officer: Officer) {
  return {
    id: officer.id,
    name: officer.name,
    position: officer.position,
    bio: officer.bio,
    image_url: officer.imageUrl,
    linkedin_url: officer.linkedinUrl,
    email: officer.email,
    order_index: officer.orderIndex,
  };
}

/**
 * Transform domain RSVP to UI component props
 */
export function toRSVPUIProps(rsvp: RSVP) {
  return {
    id: rsvp.id,
    eventId: rsvp.eventId,
    name: rsvp.name,
    email: rsvp.email,
    comment: rsvp.comment,
    timestamp: rsvp.registeredAt.toISOString(),
  };
}

/**
 * Transform form data to API request
 */
export function toCreateEventRequest(data: {
  title: string;
  description: string;
  location: string;
  startTime: string;
}) {
  return {
    title: data.title,
    description: data.description || undefined,
    location: data.location || undefined,
    event_date: data.startTime,
  };
}

/**
 * Transform form data to API request
 */
export function toUpdateEventRequest(data: Partial<{
  title: string;
  description: string;
  location: string;
  startTime: string;
}>) {
  const request: any = {};
  if (data.title !== undefined) request.title = data.title;
  if (data.description !== undefined) request.description = data.description;
  if (data.location !== undefined) request.location = data.location;
  if (data.startTime !== undefined) request.event_date = data.startTime;
  return request;
}

/**
 * Transform form data to API request
 */
export function toCreateAnnouncementRequest(data: {
  content: string;
  displayText?: string;
  isPinned?: boolean;
  isDraft?: boolean;
}) {
  return {
    content: data.content,
    display_text: data.displayText,
    pinned: data.isPinned,
    is_draft: data.isDraft,
  };
}

/**
 * Transform form data to API request
 */
export function toUpdateAnnouncementRequest(data: Partial<{
  content: string;
  displayText?: string;
  isPinned?: boolean;
  isDraft?: boolean;
}>) {
  const request: any = {};
  if (data.content !== undefined) request.content = data.content;
  if (data.displayText !== undefined) request.display_text = data.displayText;
  if (data.isPinned !== undefined) request.pinned = data.isPinned;
  if (data.isDraft !== undefined) request.is_draft = data.isDraft;
  return request;
}

/**
 * Transform form data to API request
 */
export function toCreateOfficerRequest(data: {
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  email?: string;
  orderIndex?: number;
}) {
  return {
    name: data.name,
    position: data.position,
    bio: data.bio,
    image_url: data.imageUrl,
    linkedin_url: data.linkedinUrl,
    email: data.email,
    order_index: data.orderIndex,
  };
}

/**
 * Transform form data to API request
 */
export function toUpdateOfficerRequest(data: Partial<{
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  email?: string;
  orderIndex?: number;
}>) {
  const request: any = {};
  if (data.name !== undefined) request.name = data.name;
  if (data.position !== undefined) request.position = data.position;
  if (data.bio !== undefined) request.bio = data.bio;
  if (data.imageUrl !== undefined) request.image_url = data.imageUrl;
  if (data.linkedinUrl !== undefined) request.linkedin_url = data.linkedinUrl;
  if (data.email !== undefined) request.email = data.email;
  if (data.orderIndex !== undefined) request.order_index = data.orderIndex;
  return request;
}
