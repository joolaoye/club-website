# 🤝 Contributing to CS Club Website

Thank you for your interest in contributing to the CS Club Website! We welcome contributions from everyone, whether you're a beginner or an experienced developer. This guide will walk you through the process step-by-step.

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Making Changes](#-making-changes)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [Code Style Guidelines](#-code-style-guidelines)
- [Project Structure](#-project-structure)
- [Common Tasks](#-common-tasks)
- [Getting Help](#-getting-help)

## 📚 Prerequisites

Before you begin, make sure you have:

1. **Docker Desktop** installed: [Download here](https://www.docker.com/products/docker-desktop/)
2. **Git** installed: [Download here](https://git-scm.com/downloads)
3. **Node.js** (v20+) and **pnpm**: [Download Node.js](https://nodejs.org/)
   ```bash
   # Install pnpm after Node.js
   npm install -g pnpm
   ```

## 🚀 Getting Started

### Step 1: Fork the Repository

1. Go to the [CS Club Website repository](https://github.com/Computer-Science-Club-SCSU-University/club-website.git)
2. Click the **"Fork"** button in the top-right corner
3. This creates a copy of the repository in your GitHub account

### Step 2: Clone Your Fork

```bash
# Clone your forked repository (replace YOUR_USERNAME)
git clone https://github.com/Computer-Science-Club-SCSU-University/club-website.git

# Navigate to the project directory
cd club-website

# Add the original repository as "upstream"
git remote add upstream https://github.com/Computer-Science-Club-SCSU-University/club-website.git
```

### Step 3: Set Up the Development Environment

```bash
# Install dependencies and set up the database
pnpm setup

# Start all services (frontend, backend, database)
pnpm dev
```

That's it! The application should now be running:
- **Public Website**: http://localhost:3000
- **Officers Hub**: http://localhost:3001
- **API**: http://localhost:8000/api

You can login to the officers-hub with the credentials below:
- Email: officer+clerk_test@example.com
- Code: 424242

## 💻 Development Workflow

### 1. Create a New Branch

Always create a new branch for your changes:

```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes from upstream
git pull upstream main

# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

**Branch Naming Conventions:**
- `feature/` - for new features (e.g., `feature/add-event-calendar`)
- `fix/` - for bug fixes (e.g., `fix/login-error`)
- `docs/` - for documentation (e.g., `docs/update-readme`)
- `refactor/` - for code refactoring (e.g., `refactor/api-client`)

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed
- Write/update tests if applicable

### 3. Test Your Changes

```bash
# Run linting
pnpm lint

# Format your code
pnpm format

# Make sure everything still works
pnpm dev
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add event registration form"
# or
git commit -m "fix: resolve navigation menu overlap issue"
```

**Commit Message Format:**
- `feat:` - new feature
- `fix:` - bug fix
- `docs:` - documentation changes
- `style:` - formatting, missing semicolons, etc.
- `refactor:` - code restructuring
- `test:` - adding tests
- `chore:` - maintenance tasks

## 🔄 Submitting a Pull Request

### Step 1: Push Your Changes

```bash
# Push your branch to your fork
git push origin feature/your-feature-name
```

### Step 2: Create a Pull Request

1. Go to your fork on GitHub
2. Click **"Compare & pull request"** button
3. Fill out the pull request template:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] I have tested these changes locally
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123 (if applicable)
```

### Step 3: Respond to Feedback

- Be responsive to code review comments
- Make requested changes promptly
- Push additional commits to the same branch
- Be respectful and professional

## 🎨 Code Style Guidelines

### TypeScript/JavaScript
- Use functional components for React
- Use TypeScript for type safety
- Follow ESLint rules (auto-checked)

### Python (Django)
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions/classes

### General
- Keep functions small and focused
- Use meaningful variable/function names
- Add comments for complex logic
- No console.logs in production code

## 📁 Project Structure

```
club-website/
├── apps/
│   ├── public-website/    # Public-facing Next.js site
│   ├── officers-hub/      # Admin dashboard (Clerk auth)
│   └── api/              # Django REST API backend
├── packages/
│   ├── ui/               # Shared UI components
│   ├── api-client/       # API client library
│   └── domain-types/     # Shared TypeScript types
└── docker-compose.yml    # Docker configuration
```

### Where to Make Changes

- **Frontend Features**: `apps/public-website/` or `apps/officers-hub/`
- **API Endpoints**: `apps/api/api/views/`
- **Database Models**: `apps/api/api/models/`
- **Shared Components**: `packages/ui/src/components/`
- **API Types**: `packages/domain-types/src/`

## 🛠️ Common Tasks

### Adding a New API Endpoint

1. Create model in `apps/api/api/models/`
2. Create serializer in `apps/api/api/serializers/`
3. Create view in `apps/api/api/views/`
4. Add URL in `apps/api/api/urls/`
5. Run migrations: `pnpm db:makemigrations && pnpm db:migrate`

### Adding a New Page

1. Create new file in `apps/[app-name]/app/`
2. Follow Next.js app router conventions
3. Use existing components from `packages/ui/`

### Updating Database Schema

```bash
# Make migrations after model changes
pnpm db:makemigrations

# Apply migrations
pnpm db:migrate

# Reset database (WARNING: deletes all data)
pnpm db:reset
```

### Working with Docker

```bash
# View logs
pnpm logs

# Restart services
pnpm restart

# Rebuild containers (after Dockerfile changes)
pnpm dev:rebuild

# Stop everything
pnpm cleanup
```

## 🆘 Getting Help

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Django Documentation](https://docs.djangoproject.com/)
- [Docker Documentation](https://docs.docker.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
  - 🐛 [Report a Bug](.github/ISSUE_TEMPLATE/bug_report.md)
  - ✨ [Request a Feature](.github/ISSUE_TEMPLATE/feature_request.md)
  - 📚 [Documentation Issue](.github/ISSUE_TEMPLATE/documentation.md)
  - ❓ [Ask a Question](.github/ISSUE_TEMPLATE/question.md)
- **GitHub Discussions**: For questions and ideas
- **Discord**: Join our CS Club Discord for real-time help

### First-Time Contributors
Look for issues labeled with:
- `good first issue` - Great for beginners
- `help wanted` - We need help with these
- `documentation` - Help improve our docs

## 🎉 Recognition

We appreciate all contributions! Contributors are:
- Added to our [Contributors List](#contributors)
- Mentioned in release notes
- Given credit in our documentation

## ❓ FAQ

**Q: I'm new to programming, can I still contribute?**
A: Absolutely! Look for `good first issue` labels, or help with documentation. Everyone starts somewhere!

**Q: How long should I wait for my PR to be reviewed?**
A: We aim to review PRs within 48-72 hours. Feel free to ping us if it's been longer.

**Q: Can I work on multiple issues at once?**
A: Yes, but we recommend starting with one to get familiar with the process.

**Q: What if I mess something up?**
A: Don't worry! That's what code reviews are for. We're here to help and guide you.

**Q: Do I need to know both frontend and backend?**
A: No! You can contribute to either part. Pick what interests you most.

## 📜 Code of Conduct

Please note that this project is released with a Code of Conduct. By participating in this project, you agree to abide by its terms:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the community

## 🙏 Thank You!

Thank you for contributing to the CS Club Website! Your efforts help build a better platform for our computer science community. Happy coding! 🚀

---

<p align="center">
  Made with ❤️ by the CS Club Community
</p>
