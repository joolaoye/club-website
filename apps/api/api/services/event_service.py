from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from api.models import Event


class EventService:
    """
    Enhanced service layer for Event operations with status-based business rules.
    All business logic for events should be implemented here.
    """
    
    @staticmethod
    def get_all_events():
        """Get all events ordered by start time."""
        return Event.objects.all().select_related('created_by').order_by('start_at')
    
    @staticmethod
    def get_upcoming_events():
        """Get all upcoming events."""
        return Event.objects.filter(
            start_at__gt=timezone.now()
        ).select_related('created_by').order_by('start_at')
    
    @staticmethod
    def get_ongoing_events():
        """Get all ongoing events."""
        now = timezone.now()
        return Event.objects.filter(
            start_at__lte=now,
            end_at__gt=now
        ).select_related('created_by').order_by('start_at')
    
    @staticmethod
    def get_past_events():
        """Get all past events."""
        return Event.objects.filter(
            end_at__lte=timezone.now()
        ).select_related('created_by').order_by('-start_at')
    
    @staticmethod
    def get_event_by_id(event_id):
        """Get a specific event by ID."""
        try:
            return Event.objects.select_related('created_by').get(id=event_id)
        except Event.DoesNotExist:
            return None
    
    @staticmethod
    @transaction.atomic
    def create_event(user, event_data):
        """Create a new event with validation."""
        # Validate start_at is in the future
        if event_data['start_at'] <= timezone.now():
            raise ValidationError("Event start time must be in the future.")
        
        # Validate end_at > start_at
        if event_data['end_at'] <= event_data['start_at']:
            raise ValidationError("Event end time must be after start time.")
        
        event = Event.objects.create(
            title=event_data['title'],
            description=event_data.get('description'),
            location=event_data.get('location'),
            start_at=event_data['start_at'],
            end_at=event_data['end_at'],
            meeting_link=event_data.get('meeting_link'),
            slides_url=event_data.get('slides_url'),
            recording_url=event_data.get('recording_url'),
            created_by=user
        )
        return event
    
    @staticmethod
    @transaction.atomic
    def create_event_without_user(event_data):
        """Create a new event without user association (for officers hub)."""
        # Validate start_at is in the future
        if event_data['start_at'] <= timezone.now():
            raise ValidationError("Event start time must be in the future.")
        
        # Validate end_at > start_at
        if event_data['end_at'] <= event_data['start_at']:
            raise ValidationError("Event end time must be after start time.")
        
        event = Event.objects.create(
            title=event_data['title'],
            description=event_data.get('description'),
            location=event_data.get('location'),
            start_at=event_data['start_at'],
            end_at=event_data['end_at'],
            meeting_link=event_data.get('meeting_link'),
            slides_url=event_data.get('slides_url'),
            recording_url=event_data.get('recording_url'),
            created_by=None  # No user association for officers hub
        )
        return event
    
    @staticmethod
    @transaction.atomic
    def update_event(event, event_data):
        """Update an existing event with status-based restrictions."""
        editable_fields = event.get_editable_fields()
        
        # Validate that only editable fields are being updated
        for field_name in event_data.keys():
            if field_name not in editable_fields:
                raise ValidationError(
                    f"Field '{field_name}' cannot be updated for {event.status} events. "
                    f"Editable fields: {', '.join(editable_fields)}"
                )
        
        # Validate time order if both are being updated
        if 'start_at' in event_data and 'end_at' in event_data:
            if event_data['end_at'] <= event_data['start_at']:
                raise ValidationError("Event end time must be after start time.")
        elif 'start_at' in event_data:
            if event.end_at <= event_data['start_at']:
                raise ValidationError("Event end time must be after start time.")
        elif 'end_at' in event_data:
            if event_data['end_at'] <= event.start_at:
                raise ValidationError("Event end time must be after start time.")
        
        # Apply updates
        for field, value in event_data.items():
            if field in editable_fields and value is not None:
                setattr(event, field, value)
        
        event.save()
        return event
    
    @staticmethod
    @transaction.atomic
    def delete_event(event):
        """Delete an event (only if upcoming)."""
        if event.status != 'upcoming':
            raise ValidationError("Only upcoming events can be deleted.")
        
        event.delete()
        return True
    
    @staticmethod
    def get_events_with_rsvp_counts():
        """Get all events with RSVP counts."""
        from django.db.models import Count
        return Event.objects.annotate(
            rsvp_count=Count('rsvps')
        ).select_related('created_by').order_by('start_at')
    
    @staticmethod
    def sync_rsvp_to_google_calendar(event):
        """
        Future enhancement: Update Google Calendar event with RSVP count.
        This will be implemented in the next release.
        """
        # TODO: Implement Google Calendar API integration
        # - Update event description with current RSVP count
        # - Optionally add RSVP'd attendees to calendar event
        pass 