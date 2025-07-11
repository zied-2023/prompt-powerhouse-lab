# Replit.md

## Overview

This is a full-stack web application built with React/TypeScript frontend and Express backend, designed as a prompt engineering platform called "Prompt Powerhouse". The application allows users to generate, improve, and manage AI prompts through a sophisticated interface with multi-language support and theme customization. The application now includes full database integration with PostgreSQL for persistent data storage.

## Recent Changes

**July 11, 2025 - Database Integration Complete**
- Added PostgreSQL database with comprehensive schema
- Implemented DatabaseStorage replacing in-memory storage
- Created full CRUD API endpoints for categories, prompts, and prompt sessions
- Successfully tested database connectivity and operations
- Fixed language selector dropdown by adding missing translation keys

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Context for theme and language state, TanStack Query for server state
- **Routing**: React Router for client-side navigation
- **Internationalization**: Custom translation system supporting French, Arabic, and English with RTL support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: DatabaseStorage implementation using PostgreSQL (replaced in-memory storage)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Build System**: ESBuild for production builds

### Key Design Decisions
- **Monorepo Structure**: Single repository with client/, server/, and shared/ directories
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Database-First**: Schema-driven development with Drizzle ORM
- **Component-Based UI**: Reusable component library with consistent design system

## Key Components

### Frontend Components
1. **PromptGenerator**: Main prompt creation interface with category selection and AI integration
2. **PromptImprovement**: Tool for enhancing existing prompts using AI
3. **MultiStepPromptBuilder**: Guided multi-step process for complex prompt creation
4. **PromptLibrary**: Browse and manage saved prompt templates
5. **CategoryManager**: Administrative interface for managing prompt categories
6. **IntegrationPanel**: API configuration and widget generation for external integrations

### Backend Components
1. **Storage Interface**: Abstracted storage layer with both memory and database implementations
2. **Route Registration**: Centralized route management system
3. **Vite Integration**: Development server with HMR and production static file serving

### Shared Components
1. **Database Schema**: Drizzle schema definitions shared between client and server
2. **Type Definitions**: TypeScript interfaces for API contracts

## Data Flow

### Prompt Generation Flow
1. User selects category and fills form in PromptGenerator component
2. Frontend sends structured data to backend API endpoints
3. Backend processes request and interfaces with external AI services (Mistral AI)
4. Generated prompts are returned and can be saved to database
5. User can copy, modify, or save prompts to library

### Multi-Language Support
1. Language context provides current language state
2. Translation hook accesses language-specific strings
3. RTL support automatically adjusts layout for Arabic
4. Theme context manages light/dark mode preferences

### Data Persistence
1. Drizzle ORM handles database schema and migrations
2. Storage interface abstracts database operations  
3. PostgreSQL database with comprehensive schema for users, categories, prompts, and sessions
4. Full CRUD API endpoints for all data models
5. Session management for user state persistence

## External Dependencies

### AI Integration
- **Mistral AI API**: Primary AI service for prompt generation and improvement
- **API Configuration**: Configurable endpoints and authentication

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management and validation

### Development Tools
- **Vite**: Fast development server and build tool
- **Replit Plugins**: Development environment integration
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast production builds

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- In-memory storage for rapid prototyping
- Replit-specific development tools and banners

### Production Build
1. Vite builds optimized frontend bundle to dist/public
2. ESBuild compiles server code to dist/index.js
3. Static file serving for production frontend
4. PostgreSQL database with proper connection pooling

### Database Management
- Drizzle Kit for schema migrations
- Environment-based database URL configuration
- Neon Database integration for serverless PostgreSQL

### Key Build Scripts
- `dev`: Development server with TypeScript compilation
- `build`: Production build for both frontend and backend
- `start`: Production server startup
- `db:push`: Database schema synchronization

The application follows modern web development practices with a focus on type safety, developer experience, and scalable architecture suitable for a prompt engineering platform.