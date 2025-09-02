"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@club-website/ui/components/button";
import { Input } from "@club-website/ui/components/input";
import { Label } from "@club-website/ui/components/label";
import { Checkbox } from "@club-website/ui/components/checkbox";
import { 
  X, 
  Save, 
  Globe, 
  FileText,
  AlertCircle,
  Pin
} from "lucide-react";
import { useApiClient } from "@/lib/api";
import { useNavigation } from "@/components/navigation/NavigationContext";
import { toast } from "sonner";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";

// Simple markdown-like text renderer for live preview
function renderMarkdownText(text: string) {
  if (!text.trim()) return null;
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, index) => {
    if (line.trim() === '') {
      elements.push(<br key={index} />);
      return;
    }
    
    // Handle headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Simple bullet points
      elements.push(
        <div key={index} className="flex items-start gap-2 my-1">
          <span className="text-muted-foreground mt-1">•</span>
          <span>{line.slice(2)}</span>
        </div>
      );
    } else if (line.startsWith('> ')) {
      // Blockquotes
      elements.push(
        <blockquote key={index} className="border-l-4 border-muted pl-4 my-2 italic text-muted-foreground">
          {line.slice(2)}
        </blockquote>
      );
    } else {
      // Regular paragraph
      let processedLine = line;
      
      // Handle bold text **text**
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle italic text *text*
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Handle inline code `code`
      processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>');
      
      // Handle links [text](url)
      processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      elements.push(
        <p 
          key={index} 
          className="mb-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    }
  });
  
  return <div className="prose prose-sm max-w-none dark:prose-invert">{elements}</div>;
}

export default function AnnouncementEditEditor() {
  const { currentView, setView, goBack } = useNavigation();
  const announcementId = currentView.params?.id;  // Change from .data to .params
  const isEditing = Boolean(announcementId);  // Add this back - it's used later

  const [content, setContent] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Store original values to detect changes
  const [originalContent, setOriginalContent] = useState("");
  const [originalDisplayText, setOriginalDisplayText] = useState("");
  const [originalIsPinned, setOriginalIsPinned] = useState(false);

  const api = useApiClient();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Load existing announcement
  useEffect(() => {
    if (announcementId) {
      loadAnnouncement(parseInt(announcementId));
    }
  }, [announcementId]);

  const loadAnnouncement = async (id: number) => {
    try {
      setIsLoading(true);
      const announcement = await api.announcements.getById(id.toString());
      
      setContent(announcement.content);
      setDisplayText(announcement.displayText || "");
      setIsPinned(announcement.isPinned || false);
      setIsDraft(announcement.isDraft !== false);
      
      // Store original values
      setOriginalContent(announcement.content);
      setOriginalDisplayText(announcement.displayText || "");
      setOriginalIsPinned(announcement.isPinned || false);
    } catch (error) {
      console.error('Failed to load announcement:', error);
      toast.error('Failed to load announcement');
      setView('announcements');
    } finally {
      setIsLoading(false);
    }
  };

  // Track changes
  const handleContentChange = (value: string) => {
    setContent(value);
    setHasUnsavedChanges(
      value !== originalContent || 
      displayText !== originalDisplayText || 
      isPinned !== originalIsPinned
    );
  };

  const handleDisplayTextChange = (value: string) => {
    setDisplayText(value);
    setHasUnsavedChanges(
      content !== originalContent || 
      value !== originalDisplayText || 
      isPinned !== originalIsPinned
    );
  };

  const handlePinnedChange = (checked: boolean) => {
    setIsPinned(checked);
    setHasUnsavedChanges(
      content !== originalContent || 
      displayText !== originalDisplayText || 
      checked !== originalIsPinned
    );
  };

  const handleSaveChanges = async () => {
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    // Validate pinned announcements have display text
    if (isPinned && !displayText.trim()) {
      toast.error('Pinned announcements require a display title');
      return;
    }

    try {
      setIsSaving(true);
      
      const announcementData = {
        content,
        displayText: displayText || undefined,
        isPinned: isPinned,
        isDraft: isDraft, // Keep current draft status
      };

      await api.announcements.update(announcementId, announcementData);
      
      // Update original values
      setOriginalContent(content);
      setOriginalDisplayText(displayText);
      setOriginalIsPinned(isPinned);
      
      toast.success('Changes saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    // Validate pinned announcements have display text
    if (isPinned && !displayText.trim()) {
      toast.error('Pinned announcements require a display title');
      return;
    }

    try {
      setIsPublishing(true);
      
      const announcementData = {
        content,
        displayText: displayText || undefined,
        isPinned: isPinned,
        isDraft: false, // Publish
      };

      await api.announcements.update(announcementId, announcementData);
      
      setIsDraft(false);
      setHasUnsavedChanges(false);
      toast.success('Announcement published successfully!');
      setView('announcements');
    } catch (error) {
      console.error('Failed to publish announcement:', error);
      toast.error('Failed to publish announcement');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      goBack();
    }
  };

  const handleConfirmLeave = () => {
    setShowUnsavedDialog(false);
    goBack();
  };

  const handleCancelLeave = () => {
    setShowUnsavedDialog(false);
  };

  if (isLoading && isEditing) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading announcement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold sm:text-3xl">Edit Announcement</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <AlertCircle className="h-3 w-3" />
                Unsaved changes
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={handleSaveChanges}
              disabled={!content.trim() || isSaving || isPublishing || (isPinned && !displayText.trim())}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            {/* Only show Publish button for draft announcements */}
            {isDraft && (
              <Button
                onClick={handlePublish}
                disabled={!content.trim() || isSaving || isPublishing || (isPinned && !displayText.trim())}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            )}
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Editor */}
          <div className="space-y-6 flex flex-col">
            {/* Pin Setting */}
            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="pinned"
                checked={isPinned}
                onCheckedChange={(checked) => handlePinnedChange(checked === true)}
              />
              <Label htmlFor="pinned" className="text-sm">
                Pin announcement (shows prominently to users)
              </Label>
            </div>

            {/* Display Text - Only show if pinned, like CreateEditor */}
            {isPinned && (
              <div className="space-y-2">
                <Label htmlFor="display-text">
                  Display Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="display-text"
                  placeholder="Required for pinned announcements"
                  value={displayText}
                  onChange={(e) => handleDisplayTextChange(e.target.value)}
                  className="text-lg font-semibold"
                />
                {!displayText.trim() && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Display title is required for pinned announcements
                  </p>
                )}
              </div>
            )}

            {/* Content Editor */}
            <div className="flex-1 flex flex-col space-y-2 min-h-[400px]">
              <Label htmlFor="content">
                Content <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="content"
                ref={contentRef}
                placeholder="Write your announcement here..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="flex-1 w-full bg-transparent border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-none"
                style={{ 
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  fontSize: '14px',
                  lineHeight: 1.5
                }}
              />
            </div>
          </div>

          {/* Right side - Live Preview */}
          <div className="border border-border rounded-lg overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-4 py-3 border-b bg-muted/50 flex items-center gap-2">
              <div className="flex items-center gap-2">
                {isPinned && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </div>
                )}
                {isDraft && (
                  <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                    Draft
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-muted-foreground">Preview</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {displayText && (
                <h1 className="text-2xl font-bold mb-4">{displayText}</h1>
              )}
              
              {content.trim() ? (
                renderMarkdownText(content)
              ) : (
                <div className="text-muted-foreground italic">
                  Start typing to see your content preview...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </>
  );
}
