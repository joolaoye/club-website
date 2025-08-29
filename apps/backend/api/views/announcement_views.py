from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services import AnnouncementService
from api.serializers import AnnouncementSerializer, AnnouncementCreateSerializer, AnnouncementUpdateSerializer


@api_view(['GET'])
def get_announcements(request):
    """Get published announcements (public endpoint)."""
    try:
        announcements = AnnouncementService.get_published_announcements()  # Changed this line
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch announcements: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Add a new endpoint for officers hub
@api_view(['GET'])
def get_all_announcements_admin(request):
    """Get all announcements including drafts (officers hub endpoint)."""
    try:
        announcements = AnnouncementService.get_all_announcements()
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch announcements: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_announcement_by_id(request, announcement_id):
    """Get a single announcement by ID."""
    try:
        announcement = AnnouncementService.get_announcement_by_id(announcement_id)
        if not announcement:
            return Response({'error': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AnnouncementSerializer(announcement)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch announcement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_announcement(request):
    """Create a new announcement (officers hub - no auth required)."""
    serializer = AnnouncementCreateSerializer(data=request.data)
    if serializer.is_valid():
        try:
            announcement = AnnouncementService.create_announcement(serializer.validated_data)
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
    """Toggle pinned status of an announcement (officers hub - no auth required)."""
    try:
        announcement = AnnouncementService.get_announcement_by_id(announcement_id)
        if not announcement:
            return Response({'error': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get display_text from request data if provided
        display_text = request.data.get('display_text')
        
        updated_announcement = AnnouncementService.toggle_pin_status(announcement, display_text)
        serializer = AnnouncementSerializer(updated_announcement)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to toggle pin status: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT', 'PATCH'])  # Accept both PUT and PATCH
def update_announcement(request, announcement_id):
    """Update an existing announcement (officers hub - no auth required)."""
    try:
        announcement = AnnouncementService.get_announcement_by_id(announcement_id)
        if not announcement:
            return Response({'error': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Use partial=True for PATCH requests to allow partial updates
        partial = request.method == 'PATCH'
        serializer = AnnouncementUpdateSerializer(
            announcement, 
            data=request.data, 
            partial=partial
        )
        
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
    """Delete an announcement (officers hub - no auth required)."""
    try:
        announcement = AnnouncementService.get_announcement_by_id(announcement_id)
        if not announcement:
            return Response({'error': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)
        
        AnnouncementService.delete_announcement(announcement)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {'error': f'Failed to delete announcement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 