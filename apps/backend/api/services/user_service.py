from django.db import transaction
from api.models import User


class UserService:
    """
    Service layer for User operations.
    All business logic for users should be implemented here.
    """
    
    @staticmethod
    def get_current_user(clerk_user_id):
        """Get current user by Clerk ID."""
        try:
            return User.objects.get(clerk_user_id=clerk_user_id)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def get_all_officers():
        """Get all officers (admin-only operation)."""
        return User.objects.filter(is_officer=True).order_by('full_name')
    
    @staticmethod
    @transaction.atomic
    def create_or_update_user(clerk_user_id, user_data):
        """
        Create or update a user from Clerk data.
        Used by the authentication middleware.
        """
        user, created = User.objects.get_or_create(
            clerk_user_id=clerk_user_id,
            defaults={
                'email': user_data.get('email', ''),
                'full_name': user_data.get('full_name', ''),
                'role': user_data.get('role', 'Officer'),
                'is_officer': True,
            }
        )
        
        # Update existing user data if not created
        if not created:
            user.email = user_data.get('email', user.email)
            user.full_name = user_data.get('full_name', user.full_name)
            user.save()
            
        return user
    
    @staticmethod
    @transaction.atomic
    def update_user_profile(user, **kwargs):
        """Update user profile information."""
        allowed_fields = ['full_name', 'email', 'role']
        
        for field, value in kwargs.items():
            if field in allowed_fields and value is not None:
                setattr(user, field, value)
        
        user.save()
        return user 