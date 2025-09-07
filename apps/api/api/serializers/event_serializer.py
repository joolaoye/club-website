from rest_framework import serializers
from django.utils import timezone
from django.core.exceptions import ValidationError as DjangoValidationError
from api.models import Event
from .user_serializer import PublicUserSerializer


class EventSerializer(serializers.ModelSerializer):
    """Enhanced serializer for Event model with new fields and computed status."""
    
    created_by = PublicUserSerializer(read_only=True)
    status = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    can_rsvp = serializers.ReadOnlyField()
    rsvp_count = serializers.IntegerField(read_only=True, required=False)
    editable_fields = serializers.ReadOnlyField(source='get_editable_fields')
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location',
            'start_at', 'end_at', 'meeting_link',
            'slides_url', 'recording_url', 'created_by',
            'created_at', 'updated_at', 'status', 'is_upcoming',
            'is_ongoing', 'is_past', 'can_rsvp', 'rsvp_count', 
            'editable_fields',
            # Legacy field for backward compatibility
            'event_date'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at', 'event_date']
    
    def validate(self, data):
        """Validate event data."""
        # Only validate time fields if they are present (for updates)
        if 'start_at' in data and 'end_at' in data:
            if data['end_at'] <= data['start_at']:
                raise serializers.ValidationError("Event end time must be after start time.")
        return data
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating events."""
    
    class Meta:
        model = Event
        fields = ['title', 'description', 'location', 'start_at', 'end_at',
                 'meeting_link', 'slides_url', 'recording_url']
    
    def validate(self, data):
        """Validate event data."""
        if data['start_at'] <= timezone.now():
            raise serializers.ValidationError("Event start time must be in the future.")
        
        if data['end_at'] <= data['start_at']:
            raise serializers.ValidationError("Event end time must be after start time.")
        
        return data
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()


class EventUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating events with status-based field restrictions."""
    
    class Meta:
        model = Event
        fields = ['title', 'description', 'location', 'start_at', 'end_at',
                 'meeting_link', 'slides_url', 'recording_url']
        extra_kwargs = {
            'title': {'required': False},
            'description': {'required': False},
            'location': {'required': False},
            'start_at': {'required': False},
            'end_at': {'required': False},
            'meeting_link': {'required': False},
            'slides_url': {'required': False},
            'recording_url': {'required': False},
        }
    
    def validate_title(self, value):
        """Validate title length and content."""
        if value is not None and len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip() if value else value
    
    def validate(self, data):
        """Validate update data based on event status."""
        if self.instance:
            editable_fields = self.instance.get_editable_fields()
            
            for field_name in data.keys():
                if field_name not in editable_fields:
                    raise serializers.ValidationError({
                        field_name: f"This field cannot be updated for {self.instance.status} events."
                    })
        
        # Validate time order if both fields are being updated
        start_at = data.get('start_at', self.instance.start_at if self.instance else None)
        end_at = data.get('end_at', self.instance.end_at if self.instance else None)
        
        if start_at and end_at and end_at <= start_at:
            raise serializers.ValidationError("Event end time must be after start time.")
        
        return data