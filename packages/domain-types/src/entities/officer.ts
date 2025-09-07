/**
 * Core Officer entity representing a club officer
 */
export interface Officer {
    readonly id: string;
    readonly name: string;
    readonly position: string;
    readonly bio: string;
    readonly imageUrl?: string;
    readonly orderIndex: number;
}