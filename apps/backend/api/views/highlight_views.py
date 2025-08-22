from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services import HighlightService
from api.serializers import HighlightSerializer, HighlightCreateSerializer, HighlightUpdateSerializer


@api_view(['GET'])
def get_highlights(request):
    """Get all highlights (public endpoint)."""
    try:
        highlights = HighlightService.get_all_highlights()
        serializer = HighlightSerializer(highlights, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch highlights: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_highlight_detail(request, highlight_id):
    """Get highlight detail by ID (public endpoint)."""
    try:
        highlight = HighlightService.get_highlight_by_id(highlight_id)
        if not highlight:
            return Response({'error': 'Highlight not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = HighlightSerializer(highlight)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch highlight: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_highlight(request):
    """Create a new highlight (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = HighlightCreateSerializer(data=request.data)
    if serializer.is_valid():
        try:
            highlight = HighlightService.create_highlight(serializer.validated_data)
            response_serializer = HighlightSerializer(highlight)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Failed to create highlight: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_highlight(request, highlight_id):
    """Update an existing highlight (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        highlight = HighlightService.get_highlight_by_id(highlight_id)
        if not highlight:
            return Response({'error': 'Highlight not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = HighlightUpdateSerializer(data=request.data)
        if serializer.is_valid():
            updated_highlight = HighlightService.update_highlight(
                highlight, 
                serializer.validated_data
            )
            response_serializer = HighlightSerializer(updated_highlight)
            return Response(response_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to update highlight: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_highlight(request, highlight_id):
    """Delete a highlight (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        highlight = HighlightService.get_highlight_by_id(highlight_id)
        if not highlight:
            return Response({'error': 'Highlight not found'}, status=status.HTTP_404_NOT_FOUND)
        
        HighlightService.delete_highlight(highlight)
        return Response({'message': 'Highlight deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {'error': f'Failed to delete highlight: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 