from django.db import transaction, IntegrityError
from api.models import EventRSVP, Event


class RSVPService:
    """
    Service layer for EventRSVP operations.
    All business logic for event RSVPs should be implemented here.
    """
    
    @staticmethod
    def get_rsvps_for_event(event):
        """Get all RSVPs for a specific event."""
        return EventRSVP.objects.filter(event=event).order_by('-created_at')
    
    @staticmethod
    def get_rsvp_by_id(rsvp_id):
        """Get a specific RSVP by ID."""
        try:
            return EventRSVP.objects.select_related('event').get(id=rsvp_id)
        except EventRSVP.DoesNotExist:
            return None
    
    @staticmethod
    def check_existing_rsvp(event, email):
        """Check if an RSVP already exists for this event and email."""
        try:
            return EventRSVP.objects.get(event=event, email=email)
        except EventRSVP.DoesNotExist:
            return None
    
    @staticmethod
    def create_rsvp(event, rsvp_data):
        """
        Create a new RSVP for an event.
        Handles duplicate RSVP prevention.
        """
        # First check if RSVP already exists
        existing_rsvp = RSVPService.check_existing_rsvp(event, rsvp_data['email'])
        if existing_rsvp:
            return existing_rsvp, False  # Already exists
        
        # Create new RSVP
        rsvp = EventRSVP.objects.create(
            event=event,
            name=rsvp_data.get('name'),
            email=rsvp_data['email'],
            comment=rsvp_data.get('comment')
        )
        return rsvp, True  # Created successfully
    
    @staticmethod
    @transaction.atomic
    def update_rsvp(rsvp, rsvp_data):
        """Update an existing RSVP."""
        allowed_fields = ['name', 'comment']
        
        for field, value in rsvp_data.items():
            if field in allowed_fields and value is not None:
                setattr(rsvp, field, value)
        
        rsvp.save()
        return rsvp
    
    @staticmethod
    @transaction.atomic
    def delete_rsvp(rsvp):
        """Delete an RSVP."""
        rsvp.delete()
        return True
    
    @staticmethod
    def get_rsvp_count_for_event(event):
        """Get the total number of RSVPs for an event."""
        return EventRSVP.objects.filter(event=event).count()
    
    @staticmethod
    def get_all_rsvps_by_email(email):
        """Get all RSVPs by a specific email address."""
        return EventRSVP.objects.filter(email=email).select_related('event').order_by('-created_at') 