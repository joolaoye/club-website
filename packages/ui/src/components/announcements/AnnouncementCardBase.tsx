"use client";

import React from 'react';
import { Card } from "@workspace/ui/components/card";
import { formatDate } from '@workspace/ui/lib/utils';
import { Calendar, Pin } from 'lucide-react';
import { useAnnouncementPreview } from '@workspace/ui/components/announcements/AnnouncementPreviewContext';

interface Announcement {
  id: string;
  content: string;
  display_text?: string;
  pinned: boolean;
  is_draft: boolean;
  discord_message_id?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

interface AnnouncementCardBaseProps {
  announcement: Announcement;
  headerRightSlot?: React.ReactNode;
  showDraftBadge?: boolean;
  className?: string;
  onClick?: () => void; // Add this line
}

// Utility function to convert markdown to plain text and truncate
function markdownToPlainText(markdown: string, maxLength: number = 150): string {
  // Remove markdown syntax
  let plainText = markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove inline code
    .replace(/`(.*?)`/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bullet points
    .replace(/^[-*+]\s+/gm, '')
    // Replace multiple newlines with single space
    .replace(/\n+/g, ' ')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate if needed
  if (plainText.length > maxLength) {
    plainText = plainText.substring(0, maxLength).trim();
    // Try to break at word boundary
    const lastSpace = plainText.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      plainText = plainText.substring(0, lastSpace);
    }
    plainText += '...';
  }

  return plainText;
}

export function AnnouncementCardBase({ 
  announcement, 
  headerRightSlot,
  showDraftBadge = false,
  className = "",
  onClick // Add this line
}: AnnouncementCardBaseProps) {
  const { openPreview } = useAnnouncementPreview();

  const handleClick = () => {
    openPreview(announcement);
  };

  const contentSnippet = markdownToPlainText(announcement.content);

  return (
    <Card 
      className={`
        p-4 cursor-pointer transition-all duration-200 
        hover:shadow-md hover:border-primary/20 
        focus-within:ring-2 focus-within:ring-primary/20 focus-within:outline-none
        ${announcement.pinned ? 'border-primary/20 bg-primary/5' : ''}
        ${className}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View announcement from ${formatDate(announcement.created_at)}`}
    >
      <div className="space-y-3">
        {/* Header with badges and optional right slot */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {announcement.pinned && (
              <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                <Pin className="h-3 w-3" />
                Pinned
              </div>
            )}
            {showDraftBadge && announcement.is_draft && (
              <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                Draft
              </div>
            )}
          </div>
          {headerRightSlot && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {headerRightSlot}
            </div>
          )}
        </div>

        {/* Content - No title, just snippet */}
        <div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {contentSnippet}
          </p>
        </div>

        {/* Footer with date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(announcement.created_at)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
