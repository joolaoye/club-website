"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@club-website/ui/components/dialog';
import { useAnnouncementPreview } from '@club-website/ui/components/announcements/AnnouncementPreviewContext';
import { formatDate } from '@club-website/ui/lib/utils';
import { Calendar, Pin } from 'lucide-react';
import { Separator } from '@club-website/ui/components/separator';

// Simple markdown-like text renderer for basic formatting
function renderMarkdownText(text: string) {
  // Convert basic markdown to HTML-like JSX
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
    } else {
      // Regular paragraph
      let processedLine = line;
      
      // Handle bold text **text**
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle italic text *text*
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Handle inline code `code`
      processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
      
      elements.push(
        <p 
          key={index} 
          className="mb-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    }
  });
  
  return <div className="prose prose-sm max-w-none">{elements}</div>;
}

export function AnnouncementPreview() {
  const { isOpen, announcement, closePreview } = useAnnouncementPreview();

  if (!announcement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePreview()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {announcement.pinned && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </div>
                )}
                {announcement.is_draft && (
                  <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                    Draft
                  </div>
                )}
              </div>
              <DialogTitle className="text-left text-xl font-bold">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(announcement.created_at)}</span>
                </div>
              </DialogTitle>
            </div>
          </div>
          <Separator />
          
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="py-4">
            {renderMarkdownText(announcement.content)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
