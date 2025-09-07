// =============================================================================
// UI TYPES - Frontend-specific types for React components
// =============================================================================

// Component Props
export type { EventCardProps } from './components/event-card';
export type { AnnouncementCardProps } from './components/announcement-card';
export type { OfficerCardProps } from './components/officer-card';

// Officers Hub Component Props
export type {
    RSVP,
    EventApiClient,
    EventPermissions,
    EventCardOfficersHubProps,
    EventPreviewOfficersHubProps,
    EventCreateEditorProps,
    EventEditEditorProps,
    UnsavedChangesDialogProps
} from './components/event-officers-hub';

// Form Types
export type { 
    EventFormData, 
    EventFormState,
    EventFormErrors
} from './forms/event-form';
export { 
    toCreateEventRequest, 
    toUpdateEventRequest,
    validateEventForm,
    combineDateTime,
    extractDateTime,
    createInitialEventFormData,
    eventToFormData
} from './forms/event-form';

export type { 
    AnnouncementFormData, 
    AnnouncementFormState 
} from './forms/announcement-form';
export { 
    toCreateAnnouncementRequest, 
    toUpdateAnnouncementRequest 
} from './forms/announcement-form';

// Page States
export type { DashboardPageState } from './pages/dashboard';
