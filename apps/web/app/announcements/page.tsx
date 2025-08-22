"use client";

import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { Card } from "@workspace/ui/components/card";
import { HoverBorderGradient } from '@workspace/ui/components/hover-border-gradient';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { AnnouncementCard } from "@workspace/ui/components/announcements/AnnouncementCard";
import Link from 'next/link';

export default function AnnouncementsPage() {
  const { announcements, pinnedAnnouncement, loading, error } = useAnnouncements();

  // Filter out the pinned announcement from regular announcements
  const regularAnnouncements = announcements.filter(a => !a.isPinned);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">Loading announcements...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load announcements</p>
                              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Announcements
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay up to date with the latest news, events, and updates from the Computer Science Club.
            </p>
          </div>
        </section>

        {/* Announcements */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Pinned Announcement */}
            {pinnedAnnouncement && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Pinned Announcement</h2>
                <AnnouncementCard announcement={{...pinnedAnnouncement, publishedAt: pinnedAnnouncement.createdAt}} LinkComponent={Link} />
              </div>
            )}

            {/* Regular Announcements */}
            {regularAnnouncements.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {pinnedAnnouncement ? 'Recent Announcements' : 'All Announcements'}
                </h2>
                <div className="space-y-6">
                  {regularAnnouncements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={{...announcement, publishedAt: announcement.createdAt}} LinkComponent={Link} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!pinnedAnnouncement && regularAnnouncements.length === 0 && (
              <div className="text-center py-12">
                <svg 
                  className="mx-auto h-12 w-12 text-muted-foreground mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
                  />
                </svg>
                            <h3 className="text-lg font-medium text-foreground mb-2">No announcements yet</h3>
            <p className="text-muted-foreground">Check back later for updates from the CS Club!</p>
              </div>
            )}
          </div>
        </section>

        {/* Stay Connected */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Don't Miss Out
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our Discord server to get real-time notifications about new announcements, 
              events, and club activities.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              Join Our Discord
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 