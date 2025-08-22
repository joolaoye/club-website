from django.urls import path
from api.views import officer_views

urlpatterns = [
    path('', officer_views.get_officers, name='get_officers'),
    path('create/', officer_views.create_officer_profile, name='create_officer_profile'),
    path('me/', officer_views.get_current_officer_profile, name='get_current_officer_profile'),
    path('reorder/', officer_views.reorder_officers, name='reorder_officers'),
    path('<int:officer_id>/update/', officer_views.update_officer_profile, name='update_officer_profile'),
    path('<int:officer_id>/delete/', officer_views.delete_officer_profile, name='delete_officer_profile'),
] 