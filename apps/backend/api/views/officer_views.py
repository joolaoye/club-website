from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services import OfficerService
from api.serializers import (
    OfficerSerializer, 
    OfficerCreateSerializer, 
    OfficerUpdateSerializer,
    OfficerReorderSerializer
)


@api_view(['GET'])
def get_officers(request):
    """Get all publicly displayed officers (public endpoint)."""
    try:
        officers = OfficerService.get_all_officers()
        serializer = OfficerSerializer(officers, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch officers: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_officer_profile(request):
    """Create or update officer profile (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = OfficerCreateSerializer(data=request.data)
    if serializer.is_valid():
        try:
            officer = OfficerService.create_officer_profile(
                request.user, 
                serializer.validated_data
            )
            response_serializer = OfficerSerializer(officer)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Failed to create officer profile: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_officer_profile(request, officer_id):
    """Update an officer profile (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        officer = OfficerService.get_officer_by_id(officer_id)
        if not officer:
            return Response({'error': 'Officer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OfficerUpdateSerializer(data=request.data)
        if serializer.is_valid():
            updated_officer = OfficerService.update_officer_profile(
                officer, 
                serializer.validated_data
            )
            response_serializer = OfficerSerializer(updated_officer)
            return Response(response_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Failed to update officer profile: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_officer_profile(request, officer_id):
    """Delete an officer profile (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        officer = OfficerService.get_officer_by_id(officer_id)
        if not officer:
            return Response({'error': 'Officer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        OfficerService.delete_officer_profile(officer)
        return Response({'message': 'Officer profile deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {'error': f'Failed to delete officer profile: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def reorder_officers(request):
    """Reorder officers (officer-only)."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = OfficerReorderSerializer(data=request.data)
    if serializer.is_valid():
        try:
            OfficerService.reorder_officers(serializer.validated_data['officer_orders'])
            return Response({'message': 'Officers reordered successfully'})
        except Exception as e:
            return Response(
                {'error': f'Failed to reorder officers: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_current_officer_profile(request):
    """Get current user's officer profile."""
    if not request.user:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        officer = OfficerService.get_officer_by_user(request.user)
        if not officer:
            return Response({'error': 'Officer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OfficerSerializer(officer)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch officer profile: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 