from rest_framework import serializers
from django.utils import timezone
from api.models import Event
from .user_serializer import PublicUserSerializer


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model."""
    
    created_by = PublicUserSerializer(read_only=True)
    is_upcoming = serializers.ReadOnlyField()
    rsvp_count = serializers.IntegerField(read_only=True, required=False)
    
    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'location',
            'event_date',
            'created_by',
            'created_at',
            'updated_at',
            'is_upcoming',
            'rsvp_count'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def validate_event_date(self, value):
        """Ensure event date is not in the past."""
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating events."""
    
    class Meta:
        model = Event
        fields = ['title', 'description', 'location', 'event_date']
    
    def validate_event_date(self, value):
        """Ensure event date is not in the past."""
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()


class EventUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating events."""
    
    class Meta:
        model = Event
        fields = ['title', 'description', 'location', 'event_date']
    
    def validate_title(self, value):
        """Validate title length and content."""
        if value is not None and len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip() if value else value 