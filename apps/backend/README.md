# CS Club Django Backend

A production-grade Django REST API backend for the university Computer Science Club website.

## Architecture

This backend follows clean architecture principles with clear separation of concerns:

- **Models**: Database layer (`api/models/`)
- **Services**: Business logic layer (`api/services/`)
- **Views**: Request/response layer (`api/views/`)
- **Serializers**: Data transformation layer (`api/serializers/`)
- **Permissions**: Access control layer (`api/permissions/`)
- **URLs**: Routing configuration (`api/urls/`)

## Features

- **Clerk Authentication**: Officer-only access via Clerk JWT tokens
- **Public API**: Events, announcements, officers, and highlights accessible publicly
- **RSVP System**: Public RSVP creation, officer management
- **Clean Architecture**: Modular, maintainable code structure
- **PostgreSQL**: Production database with proper schema design

## API Endpoints

### Public Endpoints
- `GET /api/events/` - List upcoming events
- `GET /api/events/{id}/` - Event details
- `POST /api/events/{id}/rsvp/` - Create RSVP
- `GET /api/announcements/` - List announcements
- `GET /api/officers/` - List officers
- `GET /api/highlights/` - List highlights

### Officer-Only Endpoints
- `GET /api/users/me/` - Current user profile
- `POST /api/events/create/` - Create event
- `PUT /api/events/{id}/update/` - Update event
- `DELETE /api/events/{id}/delete/` - Delete event
- `GET /api/events/{id}/rsvps/` - View event RSVPs
- And many more...

## Setup

### 1. Install Dependencies
```bash
cd apps/backend
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
# Django
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=cs_club
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Clerk Auth
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# CORS (for Next.js frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Database Setup
```bash
# Create and apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver 8000
```

## Authentication

The backend uses Clerk for authentication. Officers authenticate via JWT tokens sent in the `Authorization` header:

```
Authorization: Bearer <clerk-jwt-token>
```

### Middleware Flow
1. Extract JWT token from Authorization header
2. Verify token with Clerk
3. Get or create User record based on `clerk_user_id`
4. Attach user to `request.user`
5. Block access if `is_officer != True`

## Database Schema

The backend implements the following PostgreSQL schema:

- **users**: Officer authentication and profiles
- **events**: CS Club events
- **announcements**: Club announcements with pinning
- **officers**: Public officer profiles and ordering
- **highlights**: Past projects and achievements
- **event_rsvps**: Public event RSVPs with email uniqueness

## Usage Examples

### Create Event (Officer)
```bash
curl -X POST http://localhost:8000/api/events/create/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Talk: AI in CS",
    "description": "Join us for an exciting talk...",
    "location": "Room 101",
    "event_date": "2024-02-15T18:00:00Z"
  }'
```

### Public RSVP
```bash
curl -X POST http://localhost:8000/api/events/1/rsvp/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "comment": "Looking forward to it!"
  }'
```

## Development

### Adding New Features
1. Create models in `api/models/`
2. Implement business logic in `api/services/`
3. Create serializers in `api/serializers/`
4. Add views in `api/views/`
5. Configure URLs in `api/urls/`
6. Add permissions if needed in `api/permissions/`

### Testing
```bash
python manage.py test
```

## Production Deployment

1. Set `DEBUG=False`
2. Configure production database
3. Set proper `ALLOWED_HOSTS`
4. Use environment variables for sensitive data
5. Set up proper CORS origins for frontend
6. Configure static file serving
7. Use a production WSGI server (e.g., Gunicorn)

## Architecture Principles

- **Single Responsibility**: Each layer has one clear purpose
- **Dependency Inversion**: Views depend on services, not models
- **Clean Separation**: Business logic stays in services layer
- **Testability**: Easy to test each layer independently
- **Maintainability**: Clear structure for future development 