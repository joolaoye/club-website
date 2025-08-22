from rest_framework.permissions import BasePermission


class IsOfficer(BasePermission):
    """
    Permission class to allow access only to officers.
    All officers share the same access permissions.
    """
    
    def has_permission(self, request, view):
        """Check if the user is an authenticated officer."""
        return (
            request.user and 
            hasattr(request.user, 'is_officer') and 
            request.user.is_officer
        )


class IsOfficerOrReadOnly(BasePermission):
    """
    Permission class that allows read access to everyone,
    but write access only to officers.
    """
    
    def has_permission(self, request, view):
        """Allow read access to all, write access only to officers."""
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        return (
            request.user and 
            hasattr(request.user, 'is_officer') and 
            request.user.is_officer
        )


class AllowAnyRSVP(BasePermission):
    """
    Permission class for RSVP endpoints.
    Allows anyone to create RSVPs, but only officers to view/manage them.
    """
    
    def has_permission(self, request, view):
        """Allow RSVP creation to anyone, other operations to officers only."""
        # For RSVP creation (POST), allow anyone
        if request.method == 'POST':
            return True
        
        # For other operations (GET, DELETE), require officer authentication
        return (
            request.user and 
            hasattr(request.user, 'is_officer') and 
            request.user.is_officer
        ) 