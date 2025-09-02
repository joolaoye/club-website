from rest_framework import serializers
from api.models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    """Serializer for Announcement model."""
    
    class Meta:
        model = Announcement
        fields = [
            'id',
            'content',
            'display_text',
            'pinned',
            'is_draft',
            'discord_message_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_content(self, value):
        """Validate content length."""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        return value.strip()
    
    def validate_display_text(self, value):
        """Validate display_text - only required for pinned announcements."""
        if value and len(value.strip()) < 3:
            raise serializers.ValidationError("Display text must be at least 3 characters long.")
        return value.strip() if value else value
    
    def validate(self, data):
        """Cross-field validation."""
        if data.get('pinned') and not data.get('display_text'):
            raise serializers.ValidationError({
                'display_text': 'Display text is required for pinned announcements.'
            })
        return data


class AnnouncementCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating announcements."""
    
    class Meta:
        model = Announcement
        fields = ['content', 'display_text', 'pinned', 'is_draft']
    
    def validate_content(self, value):
        """Validate content length."""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        return value.strip()
    
    def validate_display_text(self, value):
        """Validate display_text - only required for pinned announcements."""
        if value and len(value.strip()) < 3:
            raise serializers.ValidationError("Display text must be at least 3 characters long.")
        return value.strip() if value else value
    
    def validate(self, data):
        """Cross-field validation."""
        if data.get('pinned') and not data.get('display_text'):
            raise serializers.ValidationError({
                'display_text': 'Display text is required for pinned announcements.'
            })
        return data


class AnnouncementUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating announcements."""
    
    class Meta:
        model = Announcement
        fields = ['content', 'display_text', 'pinned', 'is_draft']
    
    def validate_content(self, value):
        """Validate content length."""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        return value.strip()
    
    def validate_display_text(self, value):
        """Validate display_text - only required for pinned announcements."""
        if value and len(value.strip()) < 3:
            raise serializers.ValidationError("Display text must be at least 3 characters long.")
        return value.strip() if value else value
    
    def validate(self, data):
        """Cross-field validation."""
        # Get the current instance to check existing pinned status
        instance = getattr(self, 'instance', None)
        is_pinned = data.get('pinned', instance.pinned if instance else False)
        
        if is_pinned and not data.get('display_text', instance.display_text if instance else None):
            raise serializers.ValidationError({
                'display_text': 'Display text is required for pinned announcements.'
            })
        return data 