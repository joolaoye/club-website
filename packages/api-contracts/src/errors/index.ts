/**
 * API error contracts
 */

export interface ApiErrorResponse {
    error?: string;
    detail?: string;
    message?: string;
    field_errors?: Record<string, string[]>;
    code?: string;
    status?: number;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly code?: string,
        public readonly details?: Record<string, any>
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static fromResponse(response: ApiErrorResponse, status: number): ApiError {
        const message = response.error || response.detail || response.message || `HTTP ${status}`;
        return new ApiError(message, status, response.code, response);
    }
}
