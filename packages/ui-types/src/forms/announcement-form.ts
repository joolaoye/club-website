import type { CreateAnnouncementRequest, UpdateAnnouncementRequest } from '@club-website/api-contracts';

/**
 * Form data for creating/editing announcements
 */
export interface AnnouncementFormData {
    content: string;
    displayText?: string;
    isPinned: boolean;
    isDraft: boolean;
}

/**
 * State for announcement form management
 */
export interface AnnouncementFormState {
    data: AnnouncementFormData;
    errors: Partial<Record<keyof AnnouncementFormData, string>>;
    isSubmitting: boolean;
    isDirty: boolean;
}

/**
 * Convert form data to API request
 */
export function toCreateAnnouncementRequest(formData: AnnouncementFormData): CreateAnnouncementRequest {
    return {
        content: formData.content,
        display_text: formData.displayText,
        pinned: formData.isPinned,
        is_draft: formData.isDraft
    };
}

/**
 * Convert form data to update request
 */
export function toUpdateAnnouncementRequest(formData: Partial<AnnouncementFormData>): UpdateAnnouncementRequest {
    const request: UpdateAnnouncementRequest = {};
    
    if (formData.content !== undefined) request.content = formData.content;
    if (formData.displayText !== undefined) request.display_text = formData.displayText;
    if (formData.isPinned !== undefined) request.pinned = formData.isPinned;
    if (formData.isDraft !== undefined) request.is_draft = formData.isDraft;
    
    return request;
}
