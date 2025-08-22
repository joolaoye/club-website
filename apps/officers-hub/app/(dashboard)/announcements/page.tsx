"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@workspace/ui/components/dialog";
import { AnnouncementCard } from "@workspace/ui/components/announcements/AnnouncementCard";
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

const mockAnnouncements: Announcement[] = [
    { id: '1', title: 'New Feature Launch', content: 'We\'ve just launched a new feature that will revolutionize how you manage your events.', author: 'Admin', createdAt: '2023-10-26T10:00:00Z', updatedAt: '2023-10-26T10:00:00Z', isPinned: true },
    { id: '2', title: 'Scheduled Maintenance', content: 'Our services will be temporarily unavailable this weekend for scheduled maintenance.', author: 'Admin', createdAt: '2023-10-25T14:30:00Z', updatedAt: '2023-10-25T14:30:00Z', isPinned: false },
    { id: '3', title: 'Community Call', content: 'Join our monthly community call to catch up on the latest updates and provide your feedback.', author: 'Community Manager', createdAt: '2023-10-20T18:00:00Z', updatedAt: '2023-10-22T11:20:00Z', isPinned: false },
];

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="text-center py-12">
    <p className="text-muted-foreground">No announcements yet. Add one to get started!</p>
    <Button onClick={onAdd} className="mt-4">
      <Plus className="h-4 w-4 mr-2" />
      Create Announcement
    </Button>
  </div>
);

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

  const addAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement: Announcement = {
        id: Date.now().toString(),
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        author: "Current Officer", // Replace with actual user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
      };
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement({ title: "", content: "" });
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <DialogTrigger asChild>
          <Button onClick={() => { /* logic to open create dialog */ }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </DialogTrigger>
      </div>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Content"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              className="w-full p-2 border rounded"
              rows={5}
            />
            <Button onClick={addAnnouncement}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {announcements.length === 0 ? (
        <EmptyState onAdd={() => { /* logic to open create dialog */ }} />
      ) : (
        <div>
          <div className="space-y-4 mb-8">
            {announcements
              .filter(a => a.isPinned)
              .map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={{...announcement, publishedAt: announcement.createdAt}}
                  LinkComponent={Link}
                />
              ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {announcements
              .filter(a => !a.isPinned)
              .map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={{...announcement, publishedAt: announcement.createdAt}}
                  LinkComponent={Link}
                />
              ))}
          </div>
        </div>
      )}

      {selectedAnnouncement && (
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm max-w-none">
              <p>{selectedAnnouncement.content}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
              <span>By {selectedAnnouncement.author}</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 