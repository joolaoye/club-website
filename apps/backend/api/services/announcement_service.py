from django.db import transaction
from api.models import Announcement


class AnnouncementService:
    """
    Service layer for Announcement operations.
    All business logic for announcements should be implemented here.
    """
    
    @staticmethod
    def get_all_announcements():
        """Get all announcements ordered by pinned status and creation date."""
        return Announcement.objects.all().select_related('created_by')
    
    @staticmethod
    def get_pinned_announcements():
        """Get only pinned announcements."""
        return Announcement.objects.filter(
            pinned=True
        ).select_related('created_by').order_by('-created_at')
    
    @staticmethod
    def get_announcement_by_id(announcement_id):
        """Get a specific announcement by ID."""
        try:
            return Announcement.objects.select_related('created_by').get(id=announcement_id)
        except Announcement.DoesNotExist:
            return None
    
    @staticmethod
    @transaction.atomic
    def create_announcement(user, announcement_data):
        """Create a new announcement."""
        announcement = Announcement.objects.create(
            title=announcement_data['title'],
            content=announcement_data['content'],
            pinned=announcement_data.get('pinned', False),
            created_by=user
        )
        return announcement
    
    @staticmethod
    @transaction.atomic
    def update_announcement(announcement, announcement_data):
        """Update an existing announcement."""
        allowed_fields = ['title', 'content', 'pinned']
        
        for field, value in announcement_data.items():
            if field in allowed_fields and value is not None:
                setattr(announcement, field, value)
        
        announcement.save()
        return announcement
    
    @staticmethod
    @transaction.atomic
    def toggle_pin_status(announcement):
        """Toggle the pinned status of an announcement."""
        announcement.pinned = not announcement.pinned
        announcement.save()
        return announcement
    
    @staticmethod
    @transaction.atomic
    def delete_announcement(announcement):
        """Delete an announcement."""
        announcement.delete()
        return True 