"use client";

import { Card } from "@workspace/ui/components/card";
import { formatDate } from '@workspace/ui/lib/utils';
import { Calendar, User } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    author?: string;
    publishedAt: string;
    isPinned?: boolean;
  };
  LinkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

export function AnnouncementCard({ announcement, LinkComponent }: AnnouncementCardProps) {
  // Default to a regular anchor tag if no LinkComponent provided
  const Link = LinkComponent || (({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ));

  return (
    <Card className={`p-6 ${announcement.isPinned ? 'border-primary/20 bg-primary/5' : ''}`}>
      <div className="space-y-4">
        {announcement.isPinned && (
          <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
            📌 Pinned
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-card-foreground">{announcement.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {announcement.content}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {announcement.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{announcement.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(announcement.publishedAt)}</span>
            </div>
          </div>
          
          <Link 
            href={`/announcements/${announcement.id}`}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </Card>
  );
} 