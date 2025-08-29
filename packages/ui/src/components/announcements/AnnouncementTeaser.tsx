"use client";

interface AnnouncementTeaserProps {
  LinkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

export function AnnouncementTeaser({ 
  LinkComponent 
}: AnnouncementTeaserProps) {
  // Default to a regular anchor tag if no LinkComponent provided
  const Link = LinkComponent || (({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ));

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-card-foreground">Stay Updated</h2>
          <p className="text-muted-foreground max-w-md">
            Get the latest club news, important updates, and announcements from our officers.
          </p>
        </div>
        
        <Link 
          href="/announcements" 
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          View All Announcements →
        </Link>
      </div>
    </div>
  );
}
