from rest_framework import serializers
from api.models import Highlight


class HighlightSerializer(serializers.ModelSerializer):
    """Serializer for Highlight model."""
    
    class Meta:
        model = Highlight
        fields = [
            'id',
            'title',
            'description',
            'image_url',
            'link',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()
    
    def validate_image_url(self, value):
        """Validate image URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Image URL must start with http:// or https://")
        return value
    
    def validate_link(self, value):
        """Validate link URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Link must start with http:// or https://")
        return value


class HighlightCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating highlights."""
    
    class Meta:
        model = Highlight
        fields = ['title', 'description', 'image_url', 'link']
    
    def validate_title(self, value):
        """Validate title length and content."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()
    
    def validate_image_url(self, value):
        """Validate image URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Image URL must start with http:// or https://")
        return value
    
    def validate_link(self, value):
        """Validate link URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Link must start with http:// or https://")
        return value


class HighlightUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating highlights."""
    
    class Meta:
        model = Highlight
        fields = ['title', 'description', 'image_url', 'link']
    
    def validate_title(self, value):
        """Validate title length and content."""
        if value is not None and len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip() if value else value
    
    def validate_image_url(self, value):
        """Validate image URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Image URL must start with http:// or https://")
        return value
    
    def validate_link(self, value):
        """Validate link URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Link must start with http:// or https://")
        return value 