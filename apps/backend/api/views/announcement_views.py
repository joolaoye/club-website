from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services import AnnouncementService
from api.serializers import AnnouncementSerializer, AnnouncementCreateSerializer, AnnouncementUpdateSerializer


@api_view(['GET'])
def get_announcements(request):
    """Get all announcements (public endpoint)."""
    try:
        announcements = AnnouncementService.get_all_announcements()
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch announcements: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_announcement(request):
    """Create a new announcement (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = AnnouncementCreateSerializer(data=request.data)
    if serializer.is_valid():
        try:
            announcement = AnnouncementService.create_announcement(
                request.user, 
                serializer.validated_data
            )
            response_serializer = AnnouncementSerializer(announcement)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Failed to create announcement: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def toggle_announcement_pin(request, announcement_id):
    """Toggle pinned status of an announcement (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        announcement = AnnouncementService.get_announcement_by_id(announcement_id)
        if not announcement:
            return Response({'error': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updated_announcement = AnnouncementService.toggle_pin_status(announcement)
        serializer = AnnouncementSerializer(updated_announcement)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to toggle pin status: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def update_announcement(request, announcement_id):
    """Update an existing announcement (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        announcement = AnnouncementService.get_announcement_by_id(announcement_id)
        if not announcement:
            return Response({'error': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AnnouncementUpdateSerializer(data=request.data)
        if serializer.is_valid():
            updated_announcement = AnnouncementService.update_announcement(
                announcement, 
                serializer.validated_data
            )
            response_serializer = AnnouncementSerializer(updated_announcement)
            return Response(response_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to update announcement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_announcement(request, announcement_id):
    """Delete an announcement (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        announcement = AnnouncementService.get_announcement_by_id(announcement_id)
        if not announcement:
            return Response({'error': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)
        
        AnnouncementService.delete_announcement(announcement)
        return Response({'message': 'Announcement deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {'error': f'Failed to delete announcement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 