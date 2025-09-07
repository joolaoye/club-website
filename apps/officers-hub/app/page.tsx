"use client";

import { useNavigation } from "@/components/navigation/NavigationContext";
import { useApiClient } from "@/lib/api";
import { AnnouncementPreviewProvider } from "@club-website/ui/components/announcements/AnnouncementPreviewContext";
import { AnnouncementPreview } from "@club-website/ui/components/announcements/AnnouncementPreview";

// Views
import DashboardView from "@/components/views/DashboardView";
import AnnouncementsView from "@/components/views/AnnouncementsView";
import EventsView from "@/components/views/EventsView";
import OfficersView from "@/components/views/OfficersView";

// Editors
import AnnouncementCreateEditor from "@/components/editors/AnnouncementCreateEditor";
import AnnouncementEditEditor from "@/components/editors/AnnouncementEditEditor";
import EventCreateEditor from "@/components/editors/EventCreateEditor";
import EventEditEditor from "@/components/editors/EventEditEditor";
import EventPreviewWrapper from "@/components/events/EventPreviewWrapper";

// Update the component to accept props
interface AnnouncementEditEditorProps {
  announcementId?: string;
}

import OfficerCreateEditor from "@/components/editors/OfficerCreateEditor";
import OfficerEditEditor from "@/components/editors/OfficerEditEditor";

export default function RootPage() {
  const { currentView, setView } = useNavigation();
  const api = useApiClient();

  // Handle sub-views (editors)
  if (currentView.sub) {
    switch (currentView.main) {
      case 'announcements':
        return (
          <AnnouncementPreviewProvider>
            {currentView.sub === 'create' && <AnnouncementCreateEditor />}
            {currentView.sub === 'edit' && <AnnouncementEditEditor />}
            <AnnouncementPreview />
          </AnnouncementPreviewProvider>
        );
      case 'events':
        if (currentView.sub === 'create') {
          return (
            <EventCreateEditor />
          );
        }
        if (currentView.sub === 'edit' && currentView.params?.id) {
          return (
            <EventEditEditor
              eventId={currentView.params.id}
            />
          );
        }
        if (currentView.sub === 'preview' && currentView.params?.id) {
          return (
            <EventPreviewWrapper
              eventId={currentView.params.id}
              onBack={() => setView('events')}
              onEdit={(eventId) => setView('events', 'edit', { id: eventId })}
            />
          );
        }
        break;
      case 'officers':
        if (currentView.sub === 'create') {
          return <OfficerCreateEditor />;
        }
        if (currentView.sub === 'edit' && currentView.params?.officerId) {
          return <OfficerEditEditor officerId={currentView.params.officerId} />;
        }
        break;
    }
  }

  // Handle main views
  switch (currentView.main) {
    case 'dashboard':
      return <DashboardView />;
    case 'announcements':
      return <AnnouncementsView />;
    case 'events':
      return <EventsView />;
    case 'officers':
      return <OfficersView />;
    default:
      return <DashboardView />;
  }
}
