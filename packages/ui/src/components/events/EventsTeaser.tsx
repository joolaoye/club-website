"use client";

interface EventsTeaserProps {
  LinkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

export function EventsTeaser({ 
  LinkComponent 
}: EventsTeaserProps) {
  // Default to a regular anchor tag if no LinkComponent provided
  const Link = LinkComponent || (({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ));

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-fit">
      <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-card-foreground">Events & Activities</h2>
          <p className="text-muted-foreground max-w-md">
            Check out our upcoming and past events - from workshops to social gatherings and everything in between.
          </p>
        </div>
        
        <Link 
          href="/events" 
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse All Events →
        </Link>
      </div>
    </div>
  );
}
