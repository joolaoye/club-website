from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from api.services import EventService
from api.serializers import EventSerializer, EventCreateSerializer, EventUpdateSerializer


@api_view(['GET'])
def get_events(request):
    """Get all events (public endpoint)."""
    try:
        events = EventService.get_events_with_rsvp_counts()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch events: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_upcoming_events(request):
    """Get upcoming events (public endpoint)."""
    try:
        events = EventService.get_upcoming_events()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch upcoming events: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_ongoing_events(request):
    """Get ongoing events (public endpoint)."""
    try:
        events = EventService.get_ongoing_events()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch ongoing events: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_past_events(request):
    """Get past events (public endpoint)."""
    try:
        events = EventService.get_past_events()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch past events: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_event_detail(request, event_id):
    """Get event detail by ID (public endpoint)."""
    try:
        event = EventService.get_event_by_id(event_id)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EventSerializer(event)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch event: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_event(request):
    """Create a new event (officers hub - no auth required)."""
    serializer = EventCreateSerializer(data=request.data)
    if serializer.is_valid():
        try:
            event = EventService.create_event_without_user(serializer.validated_data)
            response_serializer = EventSerializer(event)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': f'Failed to create event: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
def update_event(request, event_id):
    """Update an existing event (officer-only) with status-based restrictions."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        event = EventService.get_event_by_id(event_id)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Use partial=True for PATCH requests
        partial = request.method == 'PATCH'
        serializer = EventUpdateSerializer(event, data=request.data, partial=partial)
        
        if serializer.is_valid():
            updated_event = EventService.update_event(event, serializer.validated_data)
            response_serializer = EventSerializer(updated_event)
            return Response(response_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to update event: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_event(request, event_id):
    """Delete an event (officer-only, upcoming events only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        event = EventService.get_event_by_id(event_id)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        EventService.delete_event(event)
        return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to delete event: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )