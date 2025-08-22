from django.db import transaction
from api.models import Highlight


class HighlightService:
    """
    Service layer for Highlight operations.
    All business logic for highlights/projects should be implemented here.
    """
    
    @staticmethod
    def get_all_highlights():
        """Get all highlights ordered by creation date (newest first)."""
        return Highlight.objects.all().order_by('-created_at')
    
    @staticmethod
    def get_highlight_by_id(highlight_id):
        """Get a specific highlight by ID."""
        try:
            return Highlight.objects.get(id=highlight_id)
        except Highlight.DoesNotExist:
            return None
    
    @staticmethod
    @transaction.atomic
    def create_highlight(highlight_data):
        """Create a new highlight."""
        highlight = Highlight.objects.create(
            title=highlight_data['title'],
            description=highlight_data.get('description'),
            image_url=highlight_data.get('image_url'),
            link=highlight_data.get('link')
        )
        return highlight
    
    @staticmethod
    @transaction.atomic
    def update_highlight(highlight, highlight_data):
        """Update an existing highlight."""
        allowed_fields = ['title', 'description', 'image_url', 'link']
        
        for field, value in highlight_data.items():
            if field in allowed_fields and value is not None:
                setattr(highlight, field, value)
        
        highlight.save()
        return highlight
    
    @staticmethod
    @transaction.atomic
    def delete_highlight(highlight):
        """Delete a highlight."""
        highlight.delete()
        return True
    
    @staticmethod
    def get_recent_highlights(limit=5):
        """Get recent highlights with optional limit."""
        return Highlight.objects.all().order_by('-created_at')[:limit] 