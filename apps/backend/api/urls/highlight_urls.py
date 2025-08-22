from django.urls import path
from api.views import highlight_views

urlpatterns = [
    path('', highlight_views.get_highlights, name='get_highlights'),
    path('create/', highlight_views.create_highlight, name='create_highlight'),
    path('<int:highlight_id>/', highlight_views.get_highlight_detail, name='get_highlight_detail'),
    path('<int:highlight_id>/update/', highlight_views.update_highlight, name='update_highlight'),
    path('<int:highlight_id>/delete/', highlight_views.delete_highlight, name='delete_highlight'),
] 