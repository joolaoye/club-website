"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@club-website/ui/components/card";
import { Button } from "@club-website/ui/components/button";
import { Calendar, Megaphone, Users, TrendingUp, Plus, Eye, Edit } from "lucide-react";
import { useApiClient, type Event, type Announcement, type Officer } from "@/lib/api";
import { useNavigation } from "@/components/navigation/NavigationContext";
import { toast } from "sonner";

interface DashboardStats {
  upcomingEvents: number;
  totalAnnouncements: number;
  publishedAnnouncements: number;
  draftAnnouncements: number;
  officerProfiles: number;
  totalRSVPs: number;
}

interface RecentActivity {
  id: string;
  type: 'event' | 'announcement' | 'rsvp' | 'officer';
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export default function DashboardView() {
  const { user } = useUser();
  const api = useApiClient();
  const { setView } = useNavigation();
  
  const [stats, setStats] = useState<DashboardStats>({
    upcomingEvents: 0,
    totalAnnouncements: 0,
    publishedAnnouncements: 0,
    draftAnnouncements: 0,
    officerProfiles: 0,
    totalRSVPs: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [events, announcements, officers] = await Promise.all([
        api.events.getAll(),
        api.announcements.getAll(),
        api.officers.getAll(),
      ]);

      // Calculate stats
      const now = new Date();
      const upcomingEvents = events.filter((event: Event) => 
        event.scheduledAt > now
      ).length;

      const publishedAnnouncements = announcements.filter((a: Announcement) => !a.isDraft).length;
      const draftAnnouncements = announcements.filter((a: Announcement) => a.isDraft).length;

      // Calculate total RSVPs
      const totalRSVPs = events.reduce((sum: number, event: Event) => sum + (event.rsvpCount || 0), 0);

      setStats({
        upcomingEvents,
        totalAnnouncements: announcements.length,
        publishedAnnouncements,
        draftAnnouncements,
        officerProfiles: officers.length,
        totalRSVPs,
      });

      // Generate recent activity from the data
      const activities: RecentActivity[] = [];

      // Recent events
      events
        .sort((a: Event, b: Event) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 2)
        .forEach((event: Event) => {
          activities.push({
            id: `event-${event.id}`,
            type: 'event',
            title: `New event "${event.title}" created`,
            description: event.createdAt.toLocaleDateString(),
            timestamp: event.createdAt.toISOString(),
            color: 'bg-blue-500'
          });
        });

      // Recent announcements
      announcements
        .filter((a: Announcement) => !a.isDraft)
        .sort((a: Announcement, b: Announcement) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 2)
        .forEach((announcement: Announcement) => {
          activities.push({
            id: `announcement-${announcement.id}`,
            type: 'announcement',
            title: `New announcement "${announcement.displayText || 'Untitled'}" published`,
            description: announcement.createdAt.toLocaleDateString(),
            timestamp: announcement.createdAt.toISOString(),
            color: 'bg-green-500'
          });
        });

      // Sort activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return time.toLocaleDateString();
  };

  const dashboardStats = [
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: Calendar,
      description: "Events scheduled this month",
      onClick: () => setView('events'),
    },
    {
      title: "Published Announcements",
      value: stats.publishedAnnouncements,
      icon: Megaphone,
      description: `${stats.draftAnnouncements} drafts`,
      onClick: () => setView('announcements'),
    },
    {
      title: "Officer Profiles",
      value: stats.officerProfiles,
      icon: Users,
      description: "Active officer profiles",
      onClick: () => setView('officers'),
    },
    {
      title: "Total RSVPs",
      value: stats.totalRSVPs,
      icon: TrendingUp,
      description: "RSVPs across all events",
      onClick: () => setView('events'),
    },
  ];

  const quickActions = [
    {
      title: "Create New Event",
      description: "Schedule a new club event",
      icon: Calendar,
      onClick: () => setView('events', 'create'),
    },
    {
      title: "Create Announcement",
      description: "Share news with members",
      icon: Megaphone,
      onClick: () => setView('announcements', 'create'),
    },
    {
      title: "View All Announcements",
      description: "Manage existing announcements",
      icon: Eye,
      onClick: () => setView('announcements'),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {user?.firstName || "Officer"}!
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Here's what's happening with the CS Club today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={stat.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity and Actions Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className={`w-2 h-2 ${activity.color} rounded-full mr-3 flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto"
                    onClick={action.onClick}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-medium truncate">{action.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
