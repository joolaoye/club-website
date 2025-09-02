import type { Officer } from '@club-website/domain-types';
import type { OfficerResponse } from '@club-website/api-contracts';

/**
 * Transform API officer response to domain entity
 */
export function transformOfficerResponse(response: OfficerResponse): Officer {
    return {
        id: response.id.toString(),
        name: response.name,
        position: response.position,
        bio: response.bio || '',
        imageUrl: response.image_url || undefined,
        linkedinUrl: response.linkedin_url || undefined,
        email: response.email || undefined,
        orderIndex: response.order_index
    };
}
