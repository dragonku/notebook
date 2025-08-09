# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Environment Setup
```bash
# Copy environment variables and configure
cp .env.sample .env

# Start development services (PostgreSQL, Redis, LocalStack S3)
docker-compose up -d

# Stop development services
docker-compose down
```

### Backend (Spring Boot)
```bash
cd backend

# Run application in development mode
./gradlew bootRun

# Run tests
./gradlew test

# Run specific test class
./gradlew test --tests "com.booknote.service.UserServiceTest"

# Build application
./gradlew build

# Clean build
./gradlew clean build
```

### Frontend (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production  
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

BookNote is a personal reading record application built with a modern full-stack architecture optimized for the "1 Tap record" principle - enabling users to record books within 10 seconds.

### System Architecture
- **Frontend**: React 18 + Vite SPA with TanStack Query for state management
- **Backend**: Spring Boot 3 REST API with layered architecture (Controller → Service → Repository)
- **Database**: PostgreSQL as primary database, Redis for caching and sessions
- **Storage**: AWS S3 for cover images and backup files (LocalStack for local development)
- **External Integration**: Kakao/Naver Books API for book search (proxied through backend)

### Key Architectural Patterns

**Authentication Flow**:
- JWT-based authentication with Access (15min) + Refresh (14 days) token strategy
- Token rotation on refresh for enhanced security
- Spring Security integration with method-level authorization

**Caching Strategy**:
- Redis caching for book search results (30min TTL)
- User record caching (5min TTL) with cache invalidation on updates  
- Statistics caching (1 hour TTL) with monthly aggregation optimization

**Data Flow for Quick Record (1 Tap)**:
1. Frontend: Book search with auto-complete and recent searches
2. Backend: External API call → Redis cache → Database normalization
3. Record creation: Minimal required fields → Optional details can be added later
4. Real-time updates via optimistic UI updates

### Database Schema Design
- **Core entities**: Users, Books, UserBooks (reading records), RefreshTokens
- **Performance optimization**: Strategic indexing on user_id + read_date, ISBN lookups
- **JSONB fields**: Tags stored as arrays, favorite_genres for flexible querying
- **Flyway migrations**: Located in `backend/src/main/resources/db/migration/`

### API Design Philosophy
- RESTful endpoints with consistent error responses
- Optimized for mobile-first experience (minimal payloads)
- Batch operations for data import/export functionality
- Pre-signed URLs for direct S3 file uploads

### Frontend Component Structure
- **Atomic Design**: Atoms → Molecules → Organisms → Pages pattern
- **State Management**: TanStack Query for server state, React Context for client state
- **Form Management**: React Hook Form + Zod validation for type-safe forms
- **Routing**: TanStack Router with protected routes for authenticated users

## Development Workflow

### Local Development
1. Ensure Docker is running for services (PostgreSQL, Redis, LocalStack)
2. Backend runs on port 8080 with `/api` context path
3. Frontend runs on port 5173 with Vite dev server
4. API documentation available at http://localhost:8080/api/swagger-ui.html

### Testing Strategy
- **Backend**: JUnit 5 + Testcontainers for integration tests, REST Assured for API tests
- **Database testing**: Real PostgreSQL and Redis containers via Testcontainers
- **Security testing**: Spring Security Test for authentication flows

### Monitoring and Observability
- Spring Actuator endpoints: `/api/actuator/health`, `/api/actuator/metrics`
- Prometheus metrics exposure for production monitoring
- Structured logging with correlation IDs for request tracing

### Environment Configuration
- **Local**: Uses `local` Spring profile with detailed logging and SQL output
- **Production**: Uses `prod` profile with optimized logging and security headers
- **Environment variables**: All sensitive configuration externalized via `.env` files

## Code Organization

### Backend Package Structure
- `com.booknote` - Root package with Spring Boot application class
- Domain-driven service layer organization expected:
  - `auth` - Authentication and user management
  - `book` - Book search and management  
  - `record` - Reading record CRUD operations
  - `stats` - Statistics and analytics
  - `file` - File upload/download via S3

### Frontend Module Structure  
- **Auth module**: JWT storage, token refresh, protected routes
- **Search module**: Book search with infinite scroll and recent searches
- **Library module**: Personal book collection with filtering and sorting
- **Record Editor**: Quick book recording with minimal friction
- **Stats module**: Monthly/yearly statistics with Recharts visualizations
- **Backup module**: CSV/JSON import/export functionality

### Configuration Files
- Backend configuration in `application.yml` with profile-specific overrides
- Frontend environment variables prefixed with `VITE_` for build-time inclusion
- Docker Compose for local development services with health checks