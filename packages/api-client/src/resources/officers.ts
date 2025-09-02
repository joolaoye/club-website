import type { Officer } from '@club-website/domain-types';
import type {
    CreateOfficerRequest,
    UpdateOfficerRequest,
    OfficerResponse,
    OfficerFilters
} from '@club-website/api-contracts';
import type { HttpTransport } from '../transport/http-transport';
import { transformOfficerResponse } from '../transforms/officers';

export class OfficersResource {
    constructor(private transport: HttpTransport) {}

    /**
     * Get all officers with optional filters
     */
    async getAll(filters?: OfficerFilters): Promise<Officer[]> {
        const response = await this.transport.get<OfficerResponse[]>('/officers/', {
            params: filters
        });
        return response.map(transformOfficerResponse);
    }

    /**
     * Get a single officer by ID
     */
    async getById(id: string): Promise<Officer> {
        const response = await this.transport.get<OfficerResponse>(`/officers/${id}/`);
        return transformOfficerResponse(response);
    }

    /**
     * Create a new officer
     */
    async create(request: CreateOfficerRequest): Promise<Officer> {
        const response = await this.transport.post<OfficerResponse>('/officers/create/', request);
        return transformOfficerResponse(response);
    }

    /**
     * Update an existing officer
     */
    async update(id: string, request: UpdateOfficerRequest): Promise<Officer> {
        const response = await this.transport.patch<OfficerResponse>(`/officers/${id}/update/`, request);
        return transformOfficerResponse(response);
    }

    /**
     * Delete an officer
     */
    async delete(id: string): Promise<void> {
        await this.transport.delete(`/officers/${id}/delete/`);
    }
}
