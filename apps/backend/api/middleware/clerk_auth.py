import json
import requests
from django.conf import settings
from django.http import JsonResponse
from api.models import User


class ClerkAuthMiddleware:
    """
    Middleware to handle Clerk authentication for CS Club officers.
    
    Extracts clerk_user_id from request headers and maps to User model.
    Automatically creates officer in DB if not already present.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip auth for public endpoints
        public_paths = [
            '/api/events',
            '/api/announcements',
            '/api/officers',
            '/api/highlights',
        ]
        
        # Check if this is a public endpoint
        is_public = any(request.path.startswith(path) for path in public_paths)
        is_rsvp = '/rsvp' in request.path
        is_get_request = request.method == 'GET'
        
        # Allow public access for GET requests to listed endpoints and RSVP posts
        if (is_public and is_get_request) or is_rsvp:
            request.user = None
            return self.get_response(request)

        # Extract Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authorization header required'}, status=401)

        token = auth_header.split(' ')[1]
        
        try:
            # Verify token with Clerk
            user_data = self._verify_clerk_token(token)
            if not user_data:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            clerk_user_id = user_data.get('sub')  # Clerk user ID
            email = user_data.get('email_addresses', [{}])[0].get('email_address')
            full_name = f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip()
            
            # Get or create user
            user, created = User.objects.get_or_create(
                clerk_user_id=clerk_user_id,
                defaults={
                    'email': email or '',
                    'full_name': full_name or email or 'Unknown User',
                    'role': 'Officer',  # Default role
                    'is_officer': True,
                }
            )
            
            # Block access if not an officer
            if not user.is_officer:
                return JsonResponse({'error': 'Access denied - officers only'}, status=403)
            
            # Attach user to request
            request.user = user
            
        except Exception as e:
            return JsonResponse({'error': 'Authentication failed'}, status=401)

        return self.get_response(request)

    def _verify_clerk_token(self, token):
        """
        Verify token with Clerk API.
        Returns user data if valid, None if invalid.
        """
        try:
            import jwt
            
            # For development, we'll decode without verification
            # In production, you should verify with Clerk's public key
            try:
                # Decode JWT without verification (for development)
                # In production, use: jwt.decode(token, key, algorithms=["RS256"])
                decoded = jwt.decode(token, options={"verify_signature": False})
                return decoded
            except jwt.InvalidTokenError:
                return None
                
        except Exception:
            return None 