from django.db import transaction
from api.models import Officer, User


class OfficerService:
    """
    Service layer for Officer operations.
    All business logic for officer profiles should be implemented here.
    """
    
    @staticmethod
    def get_all_officers():
        """Get all publicly displayed officers ordered by order_index."""
        return Officer.objects.all().select_related('user').order_by('order_index', 'position')
    
    @staticmethod
    def get_officer_by_id(officer_id):
        """Get a specific officer by ID."""
        try:
            return Officer.objects.select_related('user').get(id=officer_id)
        except Officer.DoesNotExist:
            return None
    
    @staticmethod
    def get_officer_by_user(user):
        """Get officer profile for a specific user."""
        try:
            return Officer.objects.select_related('user').get(user=user)
        except Officer.DoesNotExist:
            return None
    
    @staticmethod
    @transaction.atomic
    def create_officer_profile(user, officer_data):
        """Create a new officer profile."""
        # Check if officer profile already exists
        existing = OfficerService.get_officer_by_user(user)
        if existing:
            return OfficerService.update_officer_profile(existing, officer_data)
        
        officer = Officer.objects.create(
            user=user,
            position=officer_data['position'],
            bio=officer_data.get('bio'),
            image_url=officer_data.get('image_url'),
            order_index=officer_data.get('order_index', 0)
        )
        return officer
    
    @staticmethod
    @transaction.atomic
    def update_officer_profile(officer, officer_data):
        """Update an existing officer profile."""
        allowed_fields = ['position', 'bio', 'image_url', 'order_index']
        
        for field, value in officer_data.items():
            if field in allowed_fields and value is not None:
                setattr(officer, field, value)
        
        officer.save()
        return officer
    
    @staticmethod
    @transaction.atomic
    def delete_officer_profile(officer):
        """Delete an officer profile (removes from public listing)."""
        officer.delete()
        return True
    
    @staticmethod
    @transaction.atomic
    def reorder_officers(officer_orders):
        """
        Reorder officers based on provided order list.
        officer_orders should be a list of {'id': officer_id, 'order_index': index}
        """
        for item in officer_orders:
            try:
                officer = Officer.objects.get(id=item['id'])
                officer.order_index = item['order_index']
                officer.save()
            except Officer.DoesNotExist:
                continue
        
        return True 