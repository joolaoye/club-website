from django.db import models
from django.utils import timezone
from .event import Event


class EventRSVP(models.Model):
    """
    EventRSVP model for public event RSVPs.
    Anyone can RSVP to events without authentication.
    """
    event = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE, 
        related_name='rsvps',
        db_column='event_id'
    )
    name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(max_length=150)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'event_rsvps'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'email'], 
                name='unique_event_email_rsvp'
            )
        ]

    def __str__(self):
        name_display = self.name or "Anonymous"
        return f"{name_display} - {self.event.title}" 