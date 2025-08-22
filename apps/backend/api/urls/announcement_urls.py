from django.urls import path
from api.views import announcement_views

urlpatterns = [
    path('', announcement_views.get_announcements, name='get_announcements'),
    path('create/', announcement_views.create_announcement, name='create_announcement'),
    path('<int:announcement_id>/pin/', announcement_views.toggle_announcement_pin, name='toggle_announcement_pin'),
    path('<int:announcement_id>/update/', announcement_views.update_announcement, name='update_announcement'),
    path('<int:announcement_id>/delete/', announcement_views.delete_announcement, name='delete_announcement'),
] 