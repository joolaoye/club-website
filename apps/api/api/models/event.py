from django.db import models
from django.utils import timezone
from .user import User


class Event(models.Model):
    """
    Event model for CS Club events.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    event_date = models.DateTimeField()
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
        ordering = ['event_date']

    def __str__(self):
        return self.title
    
    @property
    def is_upcoming(self):
        """Check if the event is in the future."""
        return self.event_date > timezone.now() 