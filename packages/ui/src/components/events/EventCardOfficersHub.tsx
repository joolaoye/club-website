"use client";

import React, { useState } from 'react';
import { Card } from "@club-website/ui/components/card";
import { Button } from '@club-website/ui/components/button';
import { Badge } from '@club-website/ui/components/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@club-website/ui/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@club-website/ui/components/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Users,
  Video,
  FileText,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, formatTime } from '@club-website/ui/lib/utils';

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

interface ApiClient {
  delete?: (id: string) => Promise<void>;
  update?: (id: string, data: any) => Promise<void>;
}

interface EventCardOfficersHubProps {
  event: Event;
  apiClient: ApiClient;
  onEdit?: (id: string) => void;
  onPreview?: (event: Event) => void;
  permissions?: {
    canEdit?: boolean;
    canDelete?: boolean;
  };
  onChange?: () => void;
  className?: string;
}

// Get status badge styling
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

export function EventCardOfficersHub({ 
  event,
  apiClient,
  onEdit,
  onPreview,
  permissions = { canEdit: true, canDelete: true },
  onChange,
  className = ""
}: EventCardOfficersHubProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    onPreview?.(event);
  };

  const handleEdit = () => {
    onEdit?.(event.id);
  };

  const handleDelete = async () => {
    if (!apiClient.delete) return;
    
    setIsLoading(true);
    try {
      await apiClient.delete(event.id);
      setShowDeleteDialog(false);
      onChange?.();
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card 
        className={`
          group relative p-4 cursor-pointer transition-all duration-200 
          hover:shadow-md hover:border-primary/20 
          focus-within:ring-2 focus-within:ring-primary/20 focus-within:outline-none
          ${className}
        `}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`View event: ${event.title} on ${event.startAt ? formatDate(event.startAt) : 'TBD'}`}
      >
        {/* Kebab menu - appears on hover in top right */}
        <div 
          className={`absolute top-3 right-3 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-muted"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {permissions.canEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              
              {permissions.canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          {/* Header - Title and Description only */}
          <div>
            <h3 className="text-lg font-semibold text-balance leading-tight mb-2">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            )}
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
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{event.rsvpCount} RSVPs</span>
            </div>
            
            {event.meetingLink && (
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Meeting link available</span>
              </div>
            )}
          </div>

          {/* Footer with date and status badges */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {event.recordingUrl && (
                <div className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  <span>Recording</span>
                </div>
              )}
              
              {event.slidesUrl && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>Slides</span>
                </div>
              )}
            </div>
            
            {/* Status badge in bottom right */}
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className={`capitalize ${getStatusBadgeStyle(event.status)}`}
              >
                {event.status}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
              {event.rsvpCount > 0 && (
                <span className="block mt-2 text-orange-600">
                  Note: This event has {event.rsvpCount} RSVP{event.rsvpCount !== 1 ? 's' : ''}.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
