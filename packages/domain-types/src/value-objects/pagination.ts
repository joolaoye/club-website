/**
 * Value object for pagination
 */
export interface Pagination {
    readonly page: number;
    readonly limit: number;
    readonly total?: number;
}
