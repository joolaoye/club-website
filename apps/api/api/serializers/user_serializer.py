from rest_framework import serializers
from api.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = [
            'id',
            'clerk_user_id',
            'full_name',
            'email',
            'role',
            'is_officer',
            'created_at'
        ]
        read_only_fields = ['id', 'clerk_user_id', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['full_name', 'email', 'role']
        
    def validate_email(self, value):
        """Validate email format."""
        if not value or '@' not in value:
            raise serializers.ValidationError("Please provide a valid email address.")
        return value


class PublicUserSerializer(serializers.ModelSerializer):
    """Public serializer for User model (limited fields)."""
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'role'] 