"use client";

import { AnnouncementCard } from '@workspace/ui/components/announcements/AnnouncementCard';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author?: string;
  createdAt: string;
  isPinned?: boolean;
}

interface AnnouncementContainerProps {
  announcements?: Announcement[];
  loading?: boolean;
  error?: string | null;
  LinkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

export function AnnouncementContainer({ 
  announcements = [], 
  loading = false, 
  error, 
  LinkComponent 
}: AnnouncementContainerProps) {
  // Default to a regular anchor tag if no LinkComponent provided
  const Link = LinkComponent || (({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ));

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">Announcements</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">Announcements</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load announcements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Announcements</h2>
        <Link 
          href="/announcements" 
          className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>
      
      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.slice(0, 3).map((announcement) => (
            <AnnouncementCard 
              key={announcement.id} 
              announcement={{...announcement, publishedAt: announcement.createdAt}}
              LinkComponent={LinkComponent}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">No announcements</p>
          <p className="text-sm text-muted-foreground">Check back later for updates!</p>
        </div>
      )}
    </div>
  );
} 