# Ambulance Route Pre-Clearance System

## Overview

This is an emergency response coordination application that helps ambulances reach hospitals faster by sharing live location and route information with traffic police. The system consists of two main interfaces:

1. **Ambulance Driver Interface** - Allows drivers to set destinations, calculate routes, and broadcast their location/route to traffic authorities
2. **Traffic Police Interface** - Displays active emergency alerts with real-time ambulance locations and routes on an interactive map

The application is a prototype without authentication, designed for demonstration purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom emergency/red theme variables
- **Maps**: Leaflet with react-leaflet bindings for map visualization
- **Geocoding**: Geoapify API for address autocomplete and route calculation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Build System**: Vite for frontend, esbuild for backend bundling

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: shared/schema.ts
- **Migrations**: Drizzle Kit with migrations in /migrations folder
- **Key Table**: `emergency_alerts` storing ambulance ID, current/destination coordinates, route polyline, ETA, distance, and status

### API Structure
The API is organized around alerts:
- `POST /api/alerts` - Create new emergency alert
- `GET /api/alerts/active` - List all active alerts (polled by traffic police)
- `PATCH /api/alerts/:id/location` - Update ambulance position
- `PATCH /api/alerts/:id/status` - Mark alert as completed

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including Map
    pages/        # Route pages (Home, AmbulanceDriver, TrafficPolice)
    hooks/        # Custom hooks including use-alerts.ts
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route handlers
  storage.ts      # Database operations
  db.ts           # Database connection
shared/           # Shared between frontend/backend
  schema.ts       # Drizzle database schema
  routes.ts       # API contract definitions with Zod
```

## External Dependencies

### Third-Party Services
- **Geoapify API** - Used for address autocomplete and route calculation
  - API Key: `931662b2ab65485ca0b3e9e3dbabe064`
  - Endpoints: Geocoder autocomplete, routing API

### Database
- **PostgreSQL** - Primary data store
  - Connection via `DATABASE_URL` environment variable
  - Session storage uses `connect-pg-simple`

### Key NPM Packages
- **drizzle-orm** / **drizzle-kit** - Database ORM and migrations
- **leaflet** / **react-leaflet** - Interactive maps
- **@geoapify/react-geocoder-autocomplete** - Location search
- **@tanstack/react-query** - Data fetching and caching
- **zod** - Runtime type validation for API contracts
- **express** - HTTP server framework