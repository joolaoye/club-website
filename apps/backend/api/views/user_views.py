from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services import UserService
from api.serializers import UserSerializer, UserProfileSerializer


@api_view(['GET'])
def get_current_user(request):
    """Get current authenticated user profile."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
def update_current_user(request):
    """Update current user profile."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        try:
            updated_user = UserService.update_user_profile(
                request.user, 
                **serializer.validated_data
            )
            response_serializer = UserSerializer(updated_user)
            return Response(response_serializer.data)
        except Exception as e:
            return Response(
                {'error': f'Failed to update profile: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_all_officers(request):
    """Get all officers (admin-only operation)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        officers = UserService.get_all_officers()
        serializer = UserSerializer(officers, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch officers: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 