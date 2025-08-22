from django.db import models
from .user import User


class Officer(models.Model):
    """
    Officer model for publicly displayed officers.
    Subset of users shown on the public website.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='officer_profile',
        db_column='user_id'
    )
    position = models.CharField(max_length=100, help_text="e.g. 'VP of Tech', 'Treasurer'")
    bio = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    order_index = models.IntegerField(default=0, help_text="Used to control ordering on frontend")

    class Meta:
        db_table = 'officers'
        ordering = ['order_index', 'position']

    def __str__(self):
        return f"{self.user.full_name} - {self.position}" 