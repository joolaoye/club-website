from django.db import models
from django.utils import timezone


class Highlight(models.Model):
    """
    Highlight model for CS Club projects and achievements.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'highlights'
        ordering = ['-created_at']

    def __str__(self):
        return self.title 