from django.db import transaction
from api.models import Announcement


class AnnouncementService:
    """Service class for announcement operations."""
    
    @staticmethod
    def get_all_announcements():
        """Get all announcements ordered by pinned status and creation date."""
        return Announcement.objects.all()

    @staticmethod
    def get_published_announcements():
        """Get only published announcements for public consumption."""
        return Announcement.objects.filter(is_draft=False).order_by('-pinned', '-created_at')
    
    @staticmethod
    def get_pinned_announcements():
        """Get only pinned announcements."""
        return Announcement.objects.filter(
            pinned=True
        ).order_by('-created_at')
    
    @staticmethod
    def get_announcement_by_id(announcement_id):
        """Get a specific announcement by ID."""
        try:
            return Announcement.objects.get(id=announcement_id)
        except Announcement.DoesNotExist:
            return None
    
    @staticmethod
    @transaction.atomic
    def create_announcement(announcement_data):
        """Create a new announcement."""
        announcement = Announcement.objects.create(
            content=announcement_data['content'],
            display_text=announcement_data.get('display_text'),
            pinned=announcement_data.get('pinned', False),
            is_draft=announcement_data.get('is_draft', True)
        )
        return announcement
    
    @staticmethod
    @transaction.atomic
    def update_announcement(announcement, announcement_data):
        """Update an existing announcement."""
        allowed_fields = ['content', 'display_text', 'pinned', 'is_draft']
        
        for field, value in announcement_data.items():
            if field in allowed_fields:
                setattr(announcement, field, value)
        
        announcement.save()
        return announcement
    
    @staticmethod
    @transaction.atomic
    def toggle_pin_status(announcement, display_text=None):
        """Toggle the pinned status of an announcement."""
        # Check if we're pinning or unpinning based on request data
        # If display_text is provided, we're pinning; if empty/None, we're unpinning
        if display_text:
            # Pinning the announcement
            announcement.pinned = True
            announcement.display_text = display_text
        else:
            # Unpinning the announcement
            announcement.pinned = False
            announcement.display_text = None
            
        announcement.save()
        return announcement
    
    @staticmethod
    @transaction.atomic
    def delete_announcement(announcement):
        """Delete an announcement."""
        announcement.delete() 