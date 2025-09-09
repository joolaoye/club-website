import type { CreateEventRequest, UpdateEventRequest } from '@club-website/api-contracts';

/**
 * Form data for creating/editing events
 */
export interface EventFormData {
    title: string;
    description: string;
    location: string;
    startDate: Date | undefined;
    startTime: string;
    endDate: Date | undefined;
    endTime: string;
    meetingLink: string;
    slidesUrl: string;
    recordingUrl: string;
}

/**
 * State for event form management
 */
export interface EventFormState {
    data: EventFormData;
    errors: Partial<Record<keyof EventFormData, string>>;
    isSubmitting: boolean;
    isPublishing?: boolean;
    isDirty: boolean;
    hasUnsavedChanges: boolean;
}

/**
 * Validation errors for event form
 */
export interface EventFormErrors {
    title?: string;
    description?: string;
    location?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    meetingLink?: string;
    slidesUrl?: string;
    recordingUrl?: string;
    general?: string;
}

/**
 * Combine date and time into a single Date object
 */
export function combineDateTime(date: Date | undefined, time: string): Date | null {
    if (!date) return null;
    
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0, minutes || 0, 0, 0);
    return combined;
}

/**
 * Extract date and time components from a Date object
 */
export function extractDateTime(dateTime: Date): { date: Date; time: string } {
    const date = new Date(dateTime);
    const time = dateTime.toTimeString().slice(0, 5); // HH:MM format
    return { date, time };
}

/**
 * Validate event form data
 */
export function validateEventForm(formData: EventFormData): EventFormErrors {
    const errors: EventFormErrors = {};
    
    if (!formData.title.trim()) {
        errors.title = 'Event title is required';
    }
    
    if (!formData.startDate) {
        errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
        errors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate) {
        const startDateTime = combineDateTime(formData.startDate, formData.startTime);
        const endDateTime = combineDateTime(formData.endDate, formData.endTime);
        
        if (startDateTime && endDateTime && startDateTime >= endDateTime) {
            errors.endTime = 'End time must be after start time';
        }
    }
    
    // Validate URLs if provided
    const urlFields: Array<{ field: keyof EventFormData; name: string }> = [
        { field: 'meetingLink', name: 'Meeting link' },
        { field: 'slidesUrl', name: 'Slides URL' },
        { field: 'recordingUrl', name: 'Recording URL' }
    ];
    
    urlFields.forEach(({ field, name }) => {
        const value = formData[field] as string;
        if (value && value.trim()) {
            try {
                new URL(value);
            } catch {
                errors[field] = `${name} must be a valid URL`;
            }
        }
    });
    
    return errors;
}

/**
 * Convert form data to API request
 */
export function toCreateEventRequest(formData: EventFormData, isDraft: boolean = false): CreateEventRequest {
    const startDateTime = combineDateTime(formData.startDate, formData.startTime);
    const endDateTime = combineDateTime(formData.endDate, formData.endTime);
    
    if (!startDateTime || !endDateTime) {
        throw new Error('Start date and end date are required');
    }
    
    return {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        location: formData.location.trim() || undefined,
        start_at: startDateTime.toISOString(),
        end_at: endDateTime.toISOString(),
        meeting_link: formData.meetingLink.trim() || undefined,
        slides_url: formData.slidesUrl.trim() || undefined,
        recording_url: formData.recordingUrl.trim() || undefined
    };
}

/**
 * Convert form data to update request
 */
export function toUpdateEventRequest(formData: Partial<EventFormData>): UpdateEventRequest {
    const request: UpdateEventRequest = {};
    
    if (formData.title !== undefined) {
        request.title = formData.title.trim();
    }
    if (formData.description !== undefined) {
        request.description = formData.description.trim() || undefined;
    }
    if (formData.location !== undefined) {
        request.location = formData.location.trim() || undefined;
    }
    if (formData.startDate && formData.startTime) {
        const startDateTime = combineDateTime(formData.startDate, formData.startTime);
        request.start_at = startDateTime?.toISOString();
    }
    if (formData.endDate && formData.endTime) {
        const endDateTime = combineDateTime(formData.endDate, formData.endTime);
        request.end_at = endDateTime?.toISOString();
    }
    if (formData.meetingLink !== undefined) {
        request.meeting_link = formData.meetingLink.trim() || undefined;
    }
    if (formData.slidesUrl !== undefined) {
        request.slides_url = formData.slidesUrl.trim() || undefined;
    }
    if (formData.recordingUrl !== undefined) {
        request.recording_url = formData.recordingUrl.trim() || undefined;
    }
    
    return request;
}

/**
 * Create initial form data
 * Note: recordingUrl is empty by default as it's only relevant for past events
 */
export function createInitialEventFormData(): EventFormData {
    return {
        title: '',
        description: '',
        location: '',
        startDate: undefined,
        startTime: '10:00',
        endDate: undefined,
        endTime: '12:00',
        meetingLink: '',
        slidesUrl: '',
        recordingUrl: '' // Only used for past events
    };
}

/**
 * Convert event entity to form data
 */
export function eventToFormData(event: {
    title: string;
    description: string | null;
    location: string | null;
    startAt: Date;
    endAt: Date;
    meetingLink: string | null;
    slidesUrl: string | null;
    recordingUrl: string | null;
}): EventFormData {
    const { date: startDate, time: startTime } = extractDateTime(event.startAt);
    const { date: endDate, time: endTime } = extractDateTime(event.endAt);
    
    return {
        title: event.title,
        description: event.description || '',
        location: event.location || '',
        startDate,
        startTime,
        endDate,
        endTime,
        meetingLink: event.meetingLink || '',
        slidesUrl: event.slidesUrl || '',
        recordingUrl: event.recordingUrl || ''
    };
}
