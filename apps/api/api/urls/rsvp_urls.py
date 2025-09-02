from django.urls import path
from api.views import rsvp_views

urlpatterns = [
    path('stats/', rsvp_views.get_rsvp_stats, name='get_rsvp_stats'),
    path('<int:rsvp_id>/', rsvp_views.get_rsvp_detail, name='get_rsvp_detail'),
    path('<int:rsvp_id>/delete/', rsvp_views.delete_rsvp, name='delete_rsvp'),
] 