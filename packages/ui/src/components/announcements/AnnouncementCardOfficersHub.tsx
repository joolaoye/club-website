"use client";

import React, { useState } from 'react';
import { Card } from "@workspace/ui/components/card";
import { Button } from '@workspace/ui/components/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Pin, 
  PinOff, 
  Trash2,
  Calendar,
  FileText,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@workspace/ui/lib/utils';
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

interface ApiClient {
  pin?: (id: number, displayText: string) => Promise<void>;
  unpin?: (id: number) => Promise<void>;
  delete?: (id: number) => Promise<void>;
  update?: (id: number, data: any) => Promise<void>;
}

interface AnnouncementCardOfficersHubProps {
  announcement: Announcement;
  apiClient: ApiClient;
  onEdit?: (id: string) => void;
  permissions?: {
    canEdit?: boolean;
    canDelete?: boolean;
    canPin?: boolean;
  };
  onChange?: () => void;
  className?: string;
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

export function AnnouncementCardOfficersHub({ 
  announcement,
  apiClient,
  onEdit,
  permissions = { canEdit: true, canDelete: true, canPin: true },
  onChange,
  className = ""
}: AnnouncementCardOfficersHubProps) {
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [pinDisplayText, setPinDisplayText] = useState(announcement.display_text || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { openPreview } = useAnnouncementPreview();

  const contentSnippet = markdownToPlainText(announcement.content);

  const handleCardClick = () => {
    openPreview(announcement);
  };

  const handleEdit = () => {
    onEdit?.(announcement.id);
  };

  const handlePin = async () => {
    if (!apiClient.pin) return;
    
    setIsLoading(true);
    try {
      await apiClient.pin(Number(announcement.id), pinDisplayText);
      setShowPinDialog(false);
      setPinDisplayText('');
      onChange?.();
      toast.success('Announcement pinned successfully');
    } catch (error) {
      toast.error('Failed to pin announcement');
      console.error('Pin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpin = async () => {
    if (!apiClient.unpin) return;
    
    setIsLoading(true);
    try {
      await apiClient.unpin(Number(announcement.id));
      onChange?.();
      toast.success('Announcement unpinned successfully');
    } catch (error) {
      toast.error('Failed to unpin announcement');
      console.error('Unpin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!apiClient.delete) return;
    
    setIsLoading(true);
    try {
      await apiClient.delete(Number(announcement.id));
      setShowDeleteDialog(false);
      onChange?.();
      toast.success('Announcement deleted successfully');
    } catch (error) {
      toast.error('Failed to delete announcement');
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!apiClient.update) return;
    
    setIsLoading(true);
    try {
      await apiClient.update(Number(announcement.id), { is_draft: false });
      setShowPublishDialog(false);
      onChange?.();
      toast.success('Announcement published successfully');
    } catch (error) {
      toast.error('Failed to publish announcement');
      console.error('Publish error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openPinDialog = () => {
    setPinDisplayText(announcement.display_text || '');
    setShowPinDialog(true);
  };

  return (
    <>
      <Card 
        className={`
          group relative p-4 cursor-pointer transition-all duration-200 
          hover:shadow-md hover:border-primary/20 
          focus-within:ring-2 focus-within:ring-primary/20 focus-within:outline-none
          ${announcement.pinned ? 'border-primary/20 bg-primary/5' : ''}
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
        aria-label={`View announcement from ${formatDate(announcement.created_at)}`}
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
              
              {/* Add publish option for drafts */}
              {announcement.is_draft && permissions.canEdit && (
                <DropdownMenuItem onClick={() => setShowPublishDialog(true)} disabled={isLoading}>
                  <Globe className="h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              )}
              
              {permissions.canPin && (
                <>
                  {announcement.pinned ? (
                    <DropdownMenuItem onClick={handleUnpin} disabled={isLoading}>
                      <PinOff className="h-4 w-4" />
                      Unpin
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={openPinDialog} disabled={isLoading}>
                      <Pin className="h-4 w-4" />
                      Pin
                    </DropdownMenuItem>
                  )}
                </>
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
          {/* Content - No title, just snippet */}
          <div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {contentSnippet}
            </p>
          </div>

          {/* Footer with date and status badges */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(announcement.created_at)}</span>
            </div>
            
            {/* Status badges in bottom right */}
            <div className="flex items-center gap-1">
              {announcement.pinned && (
                <Button
                  size="sm"
                  className="h-6 w-6 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Pin className="h-3 w-3" />
                </Button>
              )}
              {announcement.is_draft && (
                <Button
                  size="sm"
                  className="h-6 w-6 p-0 bg-orange-500 text-white hover:bg-orange-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Pin Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pin Announcement</DialogTitle>
            <DialogDescription>
              Enter a display title for this pinned announcement. This will be shown prominently to users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="display-text">Display Title</Label>
              <Input
                id="display-text"
                value={pinDisplayText}
                onChange={(e) => setPinDisplayText(e.target.value)}
                placeholder="Enter a catchy title..."
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPinDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePin}
              disabled={!pinDisplayText.trim() || isLoading}
            >
              {isLoading ? 'Pinning...' : 'Pin Announcement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this announcement? It will be visible to all users and synced with Discord.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPublishDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
              {announcement.discord_message_id && (
                <span className="block mt-2 text-orange-600">
                  Note: This will also remove the message from Discord.
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
