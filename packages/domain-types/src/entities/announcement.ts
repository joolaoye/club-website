export interface Announcement {
    readonly id: string;
    readonly content: string;
    readonly displayText?: string;
    readonly isPinned: boolean;
    readonly isDraft: boolean;
    readonly discordMessageId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }
  