from django.db import models
from django.utils import timezone


class User(models.Model):
    """
    User model for CS Club officers only.
    Linked to Clerk authentication via clerk_user_id.
    """
    clerk_user_id = models.TextField(unique=True, help_text="Unique ID from Clerk auth")
    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150)
    role = models.CharField(max_length=100, help_text="Display role e.g. 'President', 'VP of Events'")
    is_officer = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'users'
        ordering = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.role})" 