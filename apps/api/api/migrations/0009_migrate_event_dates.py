# Data migration to populate new event date fields
from django.db import migrations
from datetime import timedelta

def migrate_event_dates(apps, schema_editor):
    """Copy existing event_date to start_at and set default end_at"""
    Event = apps.get_model('api', 'Event')
    for event in Event.objects.all():
        # Copy event_date to start_at
        event.start_at = event.event_date
        # Set default end_at to 2 hours after start_at
        event.end_at = event.event_date + timedelta(hours=2)
        event.save()

def reverse_migrate_event_dates(apps, schema_editor):
    """Reverse migration to restore event_date from start_at"""
    Event = apps.get_model('api', 'Event')
    for event in Event.objects.all():
        if event.start_at:
            event.event_date = event.start_at
            event.save()

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0008_event_schema_refactor'),
    ]

    operations = [
        migrations.RunPython(
            migrate_event_dates, 
            reverse_migrate_event_dates,
            elidable=True
        ),
    ]
