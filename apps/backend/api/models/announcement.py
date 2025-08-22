from django.db import models
from django.utils import timezone
from .user import User


class Announcement(models.Model):
    """
    Announcement model for CS Club announcements.
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    pinned = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='created_announcements',
        db_column='created_by'
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'announcements'
        ordering = ['-pinned', '-created_at']  # Pinned first, then newest

    def __str__(self):
        return self.title 