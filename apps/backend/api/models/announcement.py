from django.db import models
from django.utils import timezone


class Announcement(models.Model):
    """
    Announcement model for CS Club announcements.
    """
    content = models.TextField()
    display_text = models.CharField(max_length=200, blank=True, null=True)  # Only for pinned announcements
    pinned = models.BooleanField(default=False)
    is_draft = models.BooleanField(default=True)
    discord_message_id = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'announcements'
        ordering = ['-pinned', '-created_at']  # Pinned first, then newest

    def __str__(self):
        return self.display_text or f"Announcement {self.id}"
    
    @property
    def summary(self):
        """Return truncated content for display."""
        if len(self.content) <= 150:
            return self.content
        return self.content[:147] + "..." 