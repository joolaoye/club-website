from django.urls import path
from api.views import announcement_views

urlpatterns = [
    path('', announcement_views.get_announcements, name='get_announcements'),  # Public - published only
    path('admin/', announcement_views.get_all_announcements_admin, name='get_all_announcements_admin'),  # Officers hub - all
    path('create/', announcement_views.create_announcement, name='create_announcement'),
    path('<int:announcement_id>/', announcement_views.get_announcement_by_id, name='get_announcement_by_id'),
    path('<int:announcement_id>/pin/', announcement_views.toggle_announcement_pin, name='toggle_announcement_pin'),
    path('<int:announcement_id>/update/', announcement_views.update_announcement, name='update_announcement'),
    path('<int:announcement_id>/delete/', announcement_views.delete_announcement, name='delete_announcement'),
] 