from rest_framework import serializers
from api.models import Officer
from .user_serializer import PublicUserSerializer


class OfficerSerializer(serializers.ModelSerializer):
    """Serializer for Officer model."""
    
    user = PublicUserSerializer(read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Officer
        fields = [
            'id',
            'user',
            'full_name',
            'email',
            'position',
            'bio',
            'image_url',
            'order_index'
        ]
        read_only_fields = ['id', 'user', 'full_name', 'email']
    
    def validate_position(self, value):
        """Validate position length and content."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Position must be at least 2 characters long.")
        return value.strip()
    
    def validate_image_url(self, value):
        """Validate image URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Image URL must start with http:// or https://")
        return value


class OfficerCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating officer profiles."""
    
    class Meta:
        model = Officer
        fields = ['position', 'bio', 'image_url', 'order_index']
    
    def validate_position(self, value):
        """Validate position length and content."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Position must be at least 2 characters long.")
        return value.strip()
    
    def validate_image_url(self, value):
        """Validate image URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Image URL must start with http:// or https://")
        return value


class OfficerUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating officer profiles."""
    
    class Meta:
        model = Officer
        fields = ['position', 'bio', 'image_url', 'order_index']
    
    def validate_position(self, value):
        """Validate position length and content."""
        if value is not None and len(value.strip()) < 2:
            raise serializers.ValidationError("Position must be at least 2 characters long.")
        return value.strip() if value else value
    
    def validate_image_url(self, value):
        """Validate image URL format."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError("Image URL must start with http:// or https://")
        return value


class OfficerReorderSerializer(serializers.Serializer):
    """Serializer for reordering officers."""
    
    officer_orders = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
    
    def validate_officer_orders(self, value):
        """Validate officer order data."""
        for item in value:
            if 'id' not in item or 'order_index' not in item:
                raise serializers.ValidationError(
                    "Each item must have 'id' and 'order_index' fields."
                )
        return value 