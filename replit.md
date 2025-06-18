# RoadRescue - Roadside Assistance Mobile App

## Overview

RoadRescue is a modern, mobile-first roadside assistance application built as a full-stack web app. The application connects users who need roadside assistance with nearby mechanics, providing services like battery jumps, towing, tire changes, and lockout assistance. The app features real-time service requests, mechanic tracking, and a comprehensive service history system.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Bundling**: Vite for development and production builds
- **UI Framework**: shadcn/ui with Tailwind CSS
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing

### Mobile-First Design
The application is designed specifically for mobile devices with a responsive layout that mimics native app behavior. The max-width constraint and shadow effects create an app-like experience when viewed on larger screens.

### Database Choice
Uses Drizzle ORM with PostgreSQL for type-safe database operations. The schema supports geolocation data for proximity-based mechanic matching and comprehensive service tracking.

## Key Components

### Frontend Architecture
- **Component Library**: Built on shadcn/ui providing consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Location Services**: Browser geolocation API for user positioning
- **Real-time Updates**: React Query for automatic data synchronization

### Backend Architecture
- **API Structure**: RESTful endpoints for CRUD operations
- **Data Layer**: Drizzle ORM with PostgreSQL for persistent storage
- **In-Memory Storage**: Fallback storage implementation for development
- **Middleware**: Express middleware for request logging and error handling
- **Development Tools**: Hot module replacement via Vite middleware

### Database Schema
- **Users Table**: User profiles with location data
- **Mechanics Table**: Mechanic profiles with services, ratings, and availability
- **Service Requests Table**: Active and historical service requests
- **Service History Table**: Completed service records with reviews
- **Messages Table**: Communication between users and mechanics

## Data Flow

### Service Request Flow
1. User initiates service request with location and service type
2. System finds nearby available mechanics based on geolocation
3. Request is assigned to mechanic with estimated arrival time
4. Real-time status updates through React Query
5. Service completion triggers history record creation

### Location-Based Matching
- Browser geolocation captures user position
- Haversine formula calculates mechanic proximity
- Availability status filters active mechanics
- Price range and service type matching

### Real-Time Communication
- React Query polling for status updates
- In-app messaging system between users and mechanics
- Push-like notifications through browser APIs

## External Dependencies

### Core Runtime Dependencies
- **React Ecosystem**: React 18+ with TypeScript support
- **UI Components**: Radix UI primitives via shadcn/ui
- **Database**: Drizzle ORM with Neon Database serverless PostgreSQL
- **Forms**: React Hook Form with Hookform Resolvers
- **HTTP Client**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Development Dependencies
- **Build Tools**: Vite with React plugin and TypeScript support
- **Database Tools**: Drizzle Kit for schema migrations
- **Code Quality**: ESBuild for production bundling
- **Development Experience**: Replit integration for cloud development

### Third-Party Services
- **Database Hosting**: Neon Database for serverless PostgreSQL
- **Geolocation**: Browser-native geolocation API
- **Maps/Geocoding**: Placeholder for future Google Maps integration

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit cloud development
- **Hot Reload**: Vite development server with HMR
- **Database**: PostgreSQL 16 module in Replit environment
- **Port Configuration**: Express server on port 5000, exposed as port 80

### Production Build
- **Frontend Build**: Vite builds optimized React bundle to dist/public
- **Backend Build**: ESBuild bundles Express server to dist/index.js
- **Static Serving**: Express serves built frontend in production
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection

### Autoscale Deployment
- **Deployment Target**: Replit's autoscale infrastructure
- **Build Command**: npm run build (builds both frontend and backend)
- **Start Command**: npm run start (runs production server)
- **Health Checks**: Express server responds on configured port

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 18, 2025. Initial setup