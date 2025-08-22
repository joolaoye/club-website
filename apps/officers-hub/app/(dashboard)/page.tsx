"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Calendar, Megaphone, Users, TrendingUp } from "lucide-react";

// Mock data - replace with actual API calls
const mockStats = {
  upcomingEvents: 3,
  totalAnnouncements: 12,
  officerProfiles: 8,
  totalRSVPs: 47,
};

export default function DashboardPage() {
  const { user } = useUser();

  const stats = [
    {
      title: "Upcoming Events",
      value: mockStats.upcomingEvents,
      icon: Calendar,
      description: "Events scheduled this month",
    },
    {
      title: "Announcements",
      value: mockStats.totalAnnouncements,
      icon: Megaphone,
      description: "Total published announcements",
    },
    {
      title: "Officer Profiles",
      value: mockStats.officerProfiles,
      icon: Users,
      description: "Active officer profiles",
    },
    {
      title: "Total RSVPs",
      value: mockStats.totalRSVPs,
      icon: TrendingUp,
      description: "RSVPs across all events",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || "Officer"}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with the CS Club today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New event "Tech Talk: AI in Web Development" created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">15 new RSVPs for "Coding Bootcamp"</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Weekly newsletter published</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <p className="font-medium">Create New Event</p>
                <p className="text-sm text-muted-foreground">Schedule a new club event</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <p className="font-medium">Post Announcement</p>
                <p className="text-sm text-muted-foreground">Share news with members</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <p className="font-medium">Update Profile</p>
                <p className="text-sm text-muted-foreground">Edit your officer bio</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 