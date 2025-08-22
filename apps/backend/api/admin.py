from django.contrib import admin
from api.models import User, Event, Announcement, Officer, Highlight, EventRSVP


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'role', 'is_officer', 'created_at']
    list_filter = ['is_officer', 'role', 'created_at']
    search_fields = ['full_name', 'email', 'clerk_user_id']
    readonly_fields = ['clerk_user_id', 'created_at']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_date', 'location', 'created_by', 'created_at']
    list_filter = ['event_date', 'created_at', 'created_by']
    search_fields = ['title', 'description', 'location']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'event_date'


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'pinned', 'created_by', 'created_at']
    list_filter = ['pinned', 'created_at', 'created_by']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at']


@admin.register(Officer)
class OfficerAdmin(admin.ModelAdmin):
    list_display = ['user', 'position', 'order_index']
    list_filter = ['position']
    search_fields = ['user__full_name', 'position', 'bio']
    ordering = ['order_index', 'position']


@admin.register(Highlight)
class HighlightAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']


@admin.register(EventRSVP)
class EventRSVPAdmin(admin.ModelAdmin):
    list_display = ['event', 'name', 'email', 'created_at']
    list_filter = ['event', 'created_at']
    search_fields = ['name', 'email', 'event__title']
    readonly_fields = ['created_at'] 