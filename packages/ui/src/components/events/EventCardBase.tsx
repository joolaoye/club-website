"use client";

import React from 'react';
import { Card } from "@club-website/ui/components/card";
import { Badge } from "@club-website/ui/components/badge";
import { formatDate, formatTime } from '@club-website/ui/lib/utils';
import { Calendar, MapPin, Users, Video, FileText, Play } from 'lucide-react';
// Note: EventPreviewContext will be imported by the parent component

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: Date;
  endAt: Date;
  meetingLink: string | null;
  slidesUrl: string | null;
  recordingUrl: string | null;
  status: 'upcoming' | 'ongoing' | 'past';
  rsvpCount: number;
  canRsvp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EventCardBaseProps {
  event: Event;
  showStatusBadge?: boolean;
  showAttendeeCount?: boolean;
  headerRightSlot?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Utility function to get status badge styling
function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ongoing':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'past':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Utility function to truncate description
function truncateDescription(description: string | null, maxLength: number = 120): string {
  if (!description) return '';
  
  if (description.length <= maxLength) return description;
  
  const truncated = description.substring(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

export function EventCardBase({ 
  event, 
  showStatusBadge = false,
  showAttendeeCount = false,
  headerRightSlot,
  className = "",
  onClick
}: EventCardBaseProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Default click behavior will be handled by parent component
  };

  const descriptionSnippet = truncateDescription(event.description);

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-200 
        hover:shadow-md hover:border-primary/20 
        focus-within:ring-2 focus-within:ring-primary/20 focus-within:outline-none
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
      aria-label={`View event: ${event.title}${event.startAt ? ` on ${formatDate(event.startAt)}` : ''}`}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {event.title}
            </h3>
            {descriptionSnippet && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {descriptionSnippet}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {showStatusBadge && (
              <Badge 
                variant="outline" 
                className={`capitalize ${getStatusBadgeStyle(event.status)}`}
              >
                {event.status}
              </Badge>
            )}
            {headerRightSlot && (
              <div onClick={(e) => e.stopPropagation()}>
                {headerRightSlot}
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">
              {event.startAt ? `${formatDate(event.startAt)} at ${formatTime(event.startAt)}` : 'Date TBD'}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground truncate">{event.location}</span>
            </div>
          )}

          {showAttendeeCount && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{event.rsvpCount} attendees</span>
            </div>
          )}

          {event.meetingLink && (
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Meeting link available</span>
            </div>
          )}
        </div>

        {/* Resource Indicators */}
        {(event.recordingUrl || event.slidesUrl) && (
          <div className="flex items-center gap-4 pt-2 border-t border-border/50">
            {event.recordingUrl && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Play className="h-3 w-3" />
                <span>Recording available</span>
              </div>
            )}

            {event.slidesUrl && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>Slides available</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
