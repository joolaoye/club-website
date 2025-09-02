from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services import RSVPService, EventService
from api.serializers import RSVPSerializer, RSVPCreateSerializer


@api_view(['POST'])
def create_event_rsvp(request, event_id):
    """Create RSVP for an event (public endpoint)."""
    try:
        event = EventService.get_event_by_id(event_id)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RSVPCreateSerializer(data=request.data)
        if serializer.is_valid():
            rsvp, created = RSVPService.create_rsvp(event, serializer.validated_data)
            
            if created:
                response_serializer = RSVPSerializer(rsvp)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            else:
                # RSVP already exists
                response_serializer = RSVPSerializer(rsvp)
                return Response(
                    {
                        'message': 'RSVP already exists for this email',
                        'rsvp': response_serializer.data
                    }, 
                    status=status.HTTP_409_CONFLICT
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to create RSVP: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_event_rsvps(request, event_id):
    """Get all RSVPs for an event (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        event = EventService.get_event_by_id(event_id)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        rsvps = RSVPService.get_rsvps_for_event(event)
        serializer = RSVPSerializer(rsvps, many=True)
        
        # Include RSVP count in response
        return Response({
            'count': rsvps.count(),
            'rsvps': serializer.data
        })
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch RSVPs: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_rsvp_detail(request, rsvp_id):
    """Get RSVP detail by ID (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        rsvp = RSVPService.get_rsvp_by_id(rsvp_id)
        if not rsvp:
            return Response({'error': 'RSVP not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RSVPSerializer(rsvp)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch RSVP: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_rsvp(request, rsvp_id):
    """Delete an RSVP (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        rsvp = RSVPService.get_rsvp_by_id(rsvp_id)
        if not rsvp:
            return Response({'error': 'RSVP not found'}, status=status.HTTP_404_NOT_FOUND)
        
        RSVPService.delete_rsvp(rsvp)
        return Response({'message': 'RSVP deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {'error': f'Failed to delete RSVP: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_rsvp_stats(request):
    """Get RSVP statistics (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        from django.db.models import Count
        from api.models import EventRSVP, Event
        
        total_rsvps = EventRSVP.objects.count()
        unique_emails = EventRSVP.objects.values('email').distinct().count()
        events_with_rsvps = Event.objects.filter(rsvps__isnull=False).distinct().count()
        
        return Response({
            'total_rsvps': total_rsvps,
            'unique_emails': unique_emails,
            'events_with_rsvps': events_with_rsvps
        })
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch RSVP stats: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 