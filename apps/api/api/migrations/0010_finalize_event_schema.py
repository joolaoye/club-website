# Finalize event schema with constraints and indexes
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0009_migrate_event_dates'),
    ]

    operations = [
        # Make new fields required (after data migration)
        migrations.AlterField(
            model_name='event',
            name='start_at',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='event',
            name='end_at',
            field=models.DateTimeField(),
        ),
        
        # Add constraint to ensure end_at > start_at
        migrations.AddConstraint(
            model_name='event',
            constraint=models.CheckConstraint(
                check=models.Q(end_at__gt=models.F('start_at')),
                name='chk_event_time_order'
            ),
        ),
        
        # Add indexes for performance
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['start_at'], name='idx_events_start_at'),
        ),
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['end_at'], name='idx_events_end_at'),
        ),
    ]
