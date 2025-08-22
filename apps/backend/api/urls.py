from django.urls import path, include

urlpatterns = [
    path('users/', include('api.urls.user_urls')),
    path('events/', include('api.urls.event_urls')),
    path('announcements/', include('api.urls.announcement_urls')),
    path('officers/', include('api.urls.officer_urls')),
    path('highlights/', include('api.urls.highlight_urls')),
    path('rsvps/', include('api.urls.rsvp_urls')),
] 