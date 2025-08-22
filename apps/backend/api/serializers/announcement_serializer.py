from rest_framework import serializers
from api.models import Announcement
from .user_serializer import PublicUserSerializer


class AnnouncementSerializer(serializers.ModelSerializer):
    """Serializer for Announcement model."""
    
    created_by = PublicUserSerializer(read_only=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id',
            'title',
            'content',
            'pinned',
            'created_by',
            'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at']
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()
    
    def validate_content(self, value):
        """Validate content length."""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        return value.strip()


class AnnouncementCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating announcements."""
    
    class Meta:
        model = Announcement
        fields = ['title', 'content', 'pinned']
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()
    
    def validate_content(self, value):
        """Validate content length."""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        return value.strip()


class AnnouncementUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating announcements."""
    
    class Meta:
        model = Announcement
        fields = ['title', 'content', 'pinned']
    
    def validate_title(self, value):
        """Validate title length and content."""
        if value is not None and len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip() if value else value
    
    def validate_content(self, value):
        """Validate content length."""
        if value is not None and len(value.strip()) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        return value.strip() if value else value 