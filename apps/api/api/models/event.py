from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from .user import User


class Event(models.Model):
    """
    Event model for CS Club events with time-based status logic.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    
    # New timestamp fields
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    
    # URL fields (no rsvp_link as RSVPs are handled internally)
    meeting_link = models.TextField(blank=True, null=True)
    slides_url = models.TextField(blank=True, null=True)
    recording_url = models.TextField(blank=True, null=True)
    
    # Keep legacy field for backward compatibility
    event_date = models.DateTimeField(null=True, blank=True)
    
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='created_events',
        db_column='created_by'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'events'
        ordering = ['start_at']
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_at__gt=models.F('start_at')),
                name='chk_event_time_order'
            ),
        ]
        indexes = [
            models.Index(fields=['start_at'], name='idx_events_start_at'),
            models.Index(fields=['end_at'], name='idx_events_end_at'),
        ]

    def clean(self):
        """Validate event data."""
        if self.start_at and self.end_at and self.end_at <= self.start_at:
            raise ValidationError("End time must be after start time.")

    def save(self, *args, **kwargs):
        self.clean()
        # Keep event_date in sync for backward compatibility
        if self.start_at:
            self.event_date = self.start_at
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    @property
    def status(self):
        """Compute event status based on current time."""
        now = timezone.now()
        if now < self.start_at:
            return 'upcoming'
        elif self.start_at <= now < self.end_at:
            return 'ongoing'
        else:
            return 'past'
    
    @property
    def is_upcoming(self):
        """Check if the event is in the future."""
        return self.status == 'upcoming'
    
    @property
    def is_ongoing(self):
        """Check if event is currently happening."""
        return self.status == 'ongoing'
    
    @property
    def is_past(self):
        """Check if event has ended."""
        return self.status == 'past'
    
    @property
    def can_rsvp(self):
        """Check if users can RSVP to this event."""
        return self.status == 'upcoming'
    
    def get_editable_fields(self):
        """Return list of fields that can be edited based on current status."""
        status = self.status
        if status == 'upcoming':
            return ['title', 'description', 'location', 'start_at', 'end_at', 
                   'meeting_link', 'slides_url', 'recording_url']
        elif status == 'ongoing':
            return ['meeting_link']
        else:  # past
            return ['slides_url', 'recording_url'] 