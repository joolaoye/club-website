from django.urls import path
from api.views import user_views

urlpatterns = [
    path('me/', user_views.get_current_user, name='get_current_user'),
    path('me/update/', user_views.update_current_user, name='update_current_user'),
    path('officers/', user_views.get_all_officers, name='get_all_officers'),
] 