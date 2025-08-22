# CS Club Website

A modern, full-stack web platform for university Computer Science Club management and public engagement. Built with Next.js, Django REST Framework, and PostgreSQL.

## 🏗️ Architecture

This is a **monorepo** containing three main applications:

- **`apps/web/`** - Public-facing Next.js website
- **`apps/officers-hub/`** - Officer management dashboard (Clerk-authenticated)
- **`apps/backend/`** - Django REST API backend
- **`packages/ui/`** - Shared UI components library

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Django 5.x, Django REST Framework, PostgreSQL
- **Authentication**: Clerk (officers-hub), Public API (web)
- **UI Components**: shadcn/ui, Aceternity UI
- **Build System**: Turbo (monorepo), pnpm
- **Deployment**: TBD (GitHub Actions planned)

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20
- **Python** >= 3.11
- **PostgreSQL** >= 14
- **pnpm** (package manager)

### 1. Clone & Install

```bash
git clone <repository-url>
cd cs-club-website
pnpm install
```

### 2. Backend Setup

```bash
cd apps/backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your database and Clerk credentials

# Setup database
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional

# Start backend server
python manage.py runserver 8000
```

### 3. Frontend Setup

#### Public Website (apps/web)
```bash
cd apps/web
pnpm dev  # Runs on http://localhost:3000
```

#### Officers Hub (apps/officers-hub)
```bash
cd apps/officers-hub

# Create environment file
touch .env.local
# Add your Clerk keys:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...

pnpm dev  # Runs on http://localhost:3001
```

### 4. Development Mode (All Apps)

```bash
# From project root - starts all apps simultaneously
pnpm dev
```

## 📁 Project Structure

```
cs-club-website/
├── apps/
│   ├── web/                    # Public Next.js website
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities & API client
│   ├── officers-hub/          # Officer dashboard
│   │   ├── app/              # Protected dashboard pages
│   │   ├── components/       # Dashboard components
│   │   ├── hooks/           # Officer-specific hooks
│   │   └── middleware.ts    # Clerk authentication
│   └── backend/              # Django REST API
│       ├── api/             # Main API app
│       │   ├── models/      # Database models
│       │   ├── services/    # Business logic
│       │   ├── views/       # API endpoints
│       │   ├── serializers/ # Data transformation
│       │   └── permissions/ # Access control
│       └── backend/         # Django settings
├── packages/
│   ├── ui/                   # Shared component library
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
└── db/
    └── schema.sql           # Database schema reference
```

## 🔧 Environment Configuration

### Backend (.env)
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

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Officers Hub (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 🎯 Features

### Public Website (`apps/web`)
- ✅ **Events**: Browse upcoming CS Club events
- ✅ **Announcements**: Latest club news and updates
- ✅ **Officers**: Meet the current leadership team
- ✅ **About**: Club information and mission
- ✅ **RSVP System**: Public event registration
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Dark/Light Mode**: System-aware theming

### Officers Hub (`apps/officers-hub`)
- ✅ **Authentication**: Clerk-based officer login
- ✅ **Dashboard**: Overview of club metrics
- ✅ **Event Management**: Create, edit, delete events
- ✅ **Announcement Management**: Publish club updates
- ✅ **Officer Management**: Manage team profiles
- ✅ **RSVP Tracking**: View event registrations
- ✅ **Protected Routes**: Officer-only access

### Backend API (`apps/backend`)
- ✅ **REST API**: Clean, documented endpoints
- ✅ **Authentication**: Clerk JWT verification
- ✅ **Public Endpoints**: Events, announcements, officers
- ✅ **Officer Endpoints**: CRUD operations
- ✅ **Database**: PostgreSQL with proper schema
- ✅ **Clean Architecture**: Services, models, views separation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style and architecture
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- **Separation of Concerns**: Keep business logic in services, UI logic in components
- **Type Safety**: Use TypeScript throughout, avoid `any` types
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize images, lazy load components, minimize bundle size

---
