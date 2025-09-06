# Midnight Networks IDE

## Overview

This is a Zero-Knowledge Circuit Playground called "Midnight Networks IDE" - an interactive web application for designing, visualizing, and testing zero-knowledge proof circuits. The application provides a visual circuit designer with drag-and-drop components, pre-built scenarios for common ZK use cases (like confidential voting), and an integrated proof generation system that simulates ZK proof workflows.

The project is built as a full-stack application with a React frontend featuring a sophisticated circuit designer interface and an Express.js backend with database integration for persisting circuit designs and proof sessions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system for consistent, accessible interface components
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: TanStack Query (React Query) for server state management and local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Circuit Visualization**: ReactFlow library for interactive node-based circuit diagrams with drag-and-drop functionality

### Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API endpoints
- **Development Setup**: Hot-reload development server with Vite middleware integration for seamless full-stack development
- **Build Process**: ESBuild for production bundling with Node.js target compilation
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development and database interface for production

### Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM with type-safe schema definitions
- **Schema Design**: 
  - `circuits` table for storing circuit designs with JSONB fields for nodes and edges
  - `proof_sessions` table for tracking proof generation attempts and results
- **Migration System**: Drizzle Kit for database schema management and migrations
- **Development Storage**: In-memory storage implementation for rapid development and testing

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: CORS configuration and standard Express security middleware setup

## External Dependencies

### Core Technologies
- **Database Provider**: Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`
- **ORM**: Drizzle ORM for type-safe database operations with Zod schema validation
- **UI Framework**: Comprehensive Radix UI component library for accessible, unstyled components

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment including error overlay and cartographer features
- **Build Tools**: Vite with React plugin, TypeScript compilation, and PostCSS for CSS processing
- **Code Quality**: TypeScript strict mode configuration with path mapping for clean imports

### Frontend Libraries
- **Data Fetching**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation
- **Utility Libraries**: 
  - `clsx` and `tailwind-merge` for conditional CSS class handling
  - `date-fns` for date manipulation
  - `class-variance-authority` for component variant management
- **Circuit Visualization**: ReactFlow with Embla Carousel for advanced interactive diagrams

### Backend Dependencies
- **Database**: PostgreSQL session storage and connection handling
- **Development**: TSX for TypeScript execution in development mode
- **Validation**: Zod integration with Drizzle for runtime type validation

The application follows a modern full-stack architecture with strong typing throughout, modular component design, and a clear separation between presentation and business logic layers.
