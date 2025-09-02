import type { Announcement } from '@club-website/domain-types';
import type {
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest,
    PinAnnouncementRequest,
    AnnouncementResponse,
    AnnouncementFilters
} from '@club-website/api-contracts';
import type { HttpTransport } from '../transport/http-transport';
import { transformAnnouncementResponse } from '../transforms/announcements';

export class AnnouncementsResource {
    constructor(private transport: HttpTransport) {}

    /**
     * Get all announcements with optional filters
     */
    async getAll(filters?: AnnouncementFilters): Promise<Announcement[]> {
        const endpoint = filters?.is_draft !== undefined ? '/announcements/admin/' : '/announcements/';
        const response = await this.transport.get<AnnouncementResponse[]>(endpoint, {
            params: filters
        });
        return response.map(transformAnnouncementResponse);
    }

    /**
     * Get a single announcement by ID
     */
    async getById(id: string): Promise<Announcement> {
        const response = await this.transport.get<AnnouncementResponse>(`/announcements/${id}/`);
        return transformAnnouncementResponse(response);
    }

    /**
     * Create a new announcement
     */
    async create(request: CreateAnnouncementRequest): Promise<Announcement> {
        const response = await this.transport.post<AnnouncementResponse>('/announcements/create/', request);
        return transformAnnouncementResponse(response);
    }

    /**
     * Update an existing announcement
     */
    async update(id: string, request: UpdateAnnouncementRequest): Promise<Announcement> {
        const response = await this.transport.patch<AnnouncementResponse>(`/announcements/${id}/update/`, request);
        return transformAnnouncementResponse(response);
    }

    /**
     * Delete an announcement
     */
    async delete(id: string): Promise<void> {
        await this.transport.delete(`/announcements/${id}/delete/`);
    }

    /**
     * Pin an announcement
     */
    async pin(id: string, displayText: string): Promise<Announcement> {
        const response = await this.transport.patch<AnnouncementResponse>(`/announcements/${id}/pin/`, {
            display_text: displayText,
            pinned: true
        });
        return transformAnnouncementResponse(response);
    }

    /**
     * Unpin an announcement
     */
    async unpin(id: string): Promise<Announcement> {
        const response = await this.transport.patch<AnnouncementResponse>(`/announcements/${id}/pin/`, {
            pinned: false
        });
        return transformAnnouncementResponse(response);
    }
}
