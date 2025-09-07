# Generated migration for event schema refactor
from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0007_auto_20250902_0438'),
    ]

    operations = [
        # Add new timestamp fields
        migrations.AddField(
            model_name='event',
            name='start_at',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='event',
            name='end_at', 
            field=models.DateTimeField(null=True, blank=True),
        ),
        
        # Add new URL fields (no rsvp_link as RSVPs are handled internally)
        migrations.AddField(
            model_name='event',
            name='meeting_link',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='slides_url',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='recording_url',
            field=models.TextField(blank=True, null=True),
        ),
    ]
