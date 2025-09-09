"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@club-website/ui/components/button";
import { Input } from "@club-website/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@club-website/ui/components/select";
import { EventCardOfficersHub } from "@club-website/ui/components/events/EventCardOfficersHub";
import { useIsMobile } from "@club-website/ui/hooks/use-mobile";
import { useApiClient, type Event as DomainEvent } from "@/lib/api";
import { toEventUIProps } from "@/lib/adapters";
import { useNavigation } from "@/components/navigation/NavigationContext";
import {
  Plus,
  Calendar,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X
} from "lucide-react";
import { toast } from "sonner";
import { EventSkeleton } from "@club-website/ui/components/events/EventSkeleton";
import { Skeleton } from "@club-website/ui/components/skeleton";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: Date;
  endAt: Date;
  meetingLink: string | null;
  slidesUrl: string | null;
  recordingUrl: string | null;
  status: 'upcoming' | 'ongoing' | 'past';
  rsvpCount: number;
  canRsvp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type SortOption = 'newest' | 'oldest' | 'updated';
type FilterOption = 'all' | 'upcoming' | 'ongoing' | 'past';

const EmptyState = ({ onAdd, filter }: { onAdd: () => void; filter: FilterOption }) => {
  const getEmptyMessage = () => {
    switch (filter) {
      case 'upcoming':
        return {
          title: "No upcoming events",
          description: "Create your first event to engage with your community."
        };
      case 'ongoing':
        return {
          title: "No ongoing events",
          description: "Events that are currently happening will appear here."
        };
      case 'past':
        return {
          title: "No past events",
          description: "Completed events will be archived here for reference."
        };
      default:
        return {
          title: "No events yet",
          description: "Create your first event to start building your community calendar!"
        };
    }
  };

  const { title, description } = getEmptyMessage();

  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <Calendar className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {description}
      </p>
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Create Event
      </Button>
    </div>
  );
};

export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const api = useApiClient();
  const { setView } = useNavigation();
  const isMobile = useIsMobile();

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.events.getAll();
      const transformedEvents: Event[] = data.map((event: DomainEvent) => {
        const uiProps = toEventUIProps(event);
        return {
          id: uiProps.id,
          title: uiProps.title,
          description: uiProps.description,
          location: uiProps.location,
          startAt: uiProps.startAt,
          endAt: uiProps.endAt,
          meetingLink: uiProps.meetingLink,
          slidesUrl: uiProps.slidesUrl,
          recordingUrl: uiProps.recordingUrl,
          status: uiProps.status,
          rsvpCount: uiProps.rsvpCount,
          canRsvp: uiProps.canRsvp,
          createdAt: uiProps.createdAt,
          updatedAt: uiProps.updatedAt,
        };
      });
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, [api.events]);

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        (event.description?.toLowerCase().includes(searchLower)) ||
        (event.location?.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    switch (filterBy) {
      case 'upcoming':
        filtered = filtered.filter(e => e.status === 'upcoming');
        break;
      case 'ongoing':
        filtered = filtered.filter(e => e.status === 'ongoing');
        break;
      case 'past':
        filtered = filtered.filter(e => e.status === 'past');
        break;
      // 'all' shows everything
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [events, searchQuery, filterBy, sortBy]);

  const handleEventChange = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateNew = useCallback(() => {
    setView('events', 'create');
  }, [setView]);

  const handleEditEvent = useCallback((eventId: string) => {
    setView('events', 'edit', { id: eventId });
  }, [setView]);

  const handlePreviewEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setView('events', 'preview', { id: event.id });
  }, [setView]);

  // Memoize the apiClient to prevent recreation on every render
  const apiClient = useMemo(() => ({
    delete: async (id: string) => { await api.events.delete(id); },
    update: async (id: string, data: any) => { await api.events.update(id, data); },
    getRSVPs: async (eventId: string) => { return await api.events.getRSVPs(eventId); },
  }), [api.events]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'newest': return 'Newest first';
      case 'oldest': return 'Oldest first';
      case 'updated': return 'Recently updated';
      default: return 'Newest first';
    }
  };

  const getFilterLabel = (filter: FilterOption) => {
    switch (filter) {
      case 'all': return 'All events';
      case 'upcoming': return 'Upcoming only';
      case 'ongoing': return 'Ongoing only';
      case 'past': return 'Past events only';
      default: return 'All events';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>

          {/* Search and filters skeleton */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-10 w-full sm:w-[180px]" />
              <Skeleton className="h-10 w-full sm:w-[160px]" />
            </div>
          </div>
        </div>

        {/* Results count skeleton */}
        <Skeleton className="h-4 w-32" />

        {/* Content skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Manage club events and view RSVPs</p>
          </div>
          <Button onClick={handleCreateNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Filters - Stack on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]" size="default">
                {sortBy === 'newest' ? (
                  <SortDesc className="h-4 w-4 mr-2" />
                ) : (
                  <SortAsc className="h-4 w-4 mr-2" />
                )}
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="updated">Recently updated</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter */}
            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
              <SelectTrigger className="w-full sm:w-[160px]" size="default">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                <SelectItem value="upcoming">Upcoming only</SelectItem>
                <SelectItem value="ongoing">Ongoing only</SelectItem>
                <SelectItem value="past">Past events only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters indicator */}
        {(searchQuery || filterBy !== 'all' || sortBy !== 'newest') && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                Search: "{searchQuery}"
              </span>
            )}
            {filterBy !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                {getFilterLabel(filterBy)}
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                {getSortLabel(sortBy)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && (
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedEvents.length === 0 ? (
            searchQuery ? "No events found" : "No events"
          ) : (
            `${filteredAndSortedEvents.length} event${filteredAndSortedEvents.length === 1 ? '' : 's'}`
          )}
        </div>
      )}

      {/* Content */}
      {filteredAndSortedEvents.length === 0 ? (
        searchQuery ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters.
            </p>
            <Button variant="outline" onClick={clearSearch}>
              Clear search
            </Button>
          </div>
        ) : (
          <EmptyState onAdd={handleCreateNew} filter={filterBy} />
        )
      ) : (
        <div className="space-y-4">
          {filteredAndSortedEvents.map((event) => (
            <EventCardOfficersHub
              key={event.id}
              event={event}
              apiClient={apiClient}
              onEdit={handleEditEvent}
              onPreview={handlePreviewEvent}
              permissions={{
                canEdit: true,
                canDelete: true,
              }}
              onChange={handleEventChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}