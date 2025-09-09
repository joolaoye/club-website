import type { Event } from '@club-website/domain-types';

/**
 * RSVP data structure
 */
export interface RSVP {
  id: string;
  name: string;
  email: string;
  response: 'yes' | 'no' | 'maybe';
  comment?: string;
  createdAt: Date;
}

/**
 * API client interface for event operations
 */
export interface EventApiClient {
  getById?: (id: string) => Promise<Event>;
  create?: (data: any) => Promise<void>;
  update?: (id: string, data: any) => Promise<void>;
  delete?: (id: string) => Promise<void>;
  getRSVPs?: (eventId: string) => Promise<RSVP[]>;
}

/**
 * Permissions for event operations
 */
export interface EventPermissions {
  canEdit?: boolean;
  canDelete?: boolean;
  canViewRSVPs?: boolean;
}

/**
 * Props for EventCardOfficersHub component
 */
export interface EventCardOfficersHubProps {
  event: Event;
  apiClient: EventApiClient;
  onEdit?: (id: string) => void;
  onPreview?: (event: Event) => void;
  permissions?: EventPermissions;
  onChange?: () => void;
  className?: string;
}

/**
 * Props for EventPreviewOfficersHub component
 */
export interface EventPreviewOfficersHubProps {
  event: Event;
  apiClient: EventApiClient;
  onBack: () => void;
  onEdit?: (eventId: string) => void;
}

/**
 * Props for EventCreateEditor component
 */
export interface EventCreateEditorProps {
  apiClient: {
    create: (data: any) => Promise<void>;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * Props for EventEditEditor component
 */
export interface EventEditEditorProps {
  eventId: string;
  apiClient: {
    getById: (id: string) => Promise<Event>;
    update: (id: string, data: any) => Promise<void>;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * Props for UnsavedChangesDialog component
 */
export interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}
