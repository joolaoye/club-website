# Generated manually to remove linkedin_url and email fields from Officer model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_finalize_event_schema'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='officer',
            name='email',
        ),
        migrations.RemoveField(
            model_name='officer',
            name='linkedin_url',
        ),
    ]
