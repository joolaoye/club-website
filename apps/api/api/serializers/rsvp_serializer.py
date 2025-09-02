from rest_framework import serializers
from api.models import EventRSVP, Event


class RSVPSerializer(serializers.ModelSerializer):
    """Serializer for EventRSVP model."""
    
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateTimeField(source='event.event_date', read_only=True)
    
    class Meta:
        model = EventRSVP
        fields = [
            'id',
            'event',
            'event_title',
            'event_date',
            'name',
            'email',
            'comment',
            'created_at'
        ]
        read_only_fields = ['id', 'event', 'event_title', 'event_date', 'created_at']
    
    def validate_email(self, value):
        """Validate email format."""
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address.")
        return value.lower().strip()
    
    def validate_name(self, value):
        """Validate name length."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip() if value else value


class RSVPCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating RSVPs."""
    
    class Meta:
        model = EventRSVP
        fields = ['name', 'email', 'comment']
    
    def validate_email(self, value):
        """Validate email format."""
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address.")
        return value.lower().strip()
    
    def validate_name(self, value):
        """Validate name length."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip() if value else value


class RSVPUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating RSVPs."""
    
    class Meta:
        model = EventRSVP
        fields = ['name', 'comment']  # Email cannot be changed to maintain uniqueness
    
    def validate_name(self, value):
        """Validate name length."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip() if value else value


class RSVPStatsSerializer(serializers.Serializer):
    """Serializer for RSVP statistics."""
    
    total_rsvps = serializers.IntegerField(read_only=True)
    unique_emails = serializers.IntegerField(read_only=True)
    events_with_rsvps = serializers.IntegerField(read_only=True) 