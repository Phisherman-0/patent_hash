# Patent Hash - Blockchain-Powered Patent Management Platform

## Overview

Patent Hash is a full-stack application for protecting intellectual property through blockchain technology and AI integration. The platform enables users to register patents with proof-of-existence timestamping using Hedera blockchain, conduct AI-powered prior art searches, and manage patent portfolios through a comprehensive dashboard. Built as a modern web application, it combines secure patent registration with advanced AI capabilities for patent analysis and verification.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript in a single-page application (SPA) architecture. The UI is built with Tailwind CSS and shadcn/ui components, providing a modern, responsive design system. The frontend uses Wouter for client-side routing and TanStack Query for state management and server communication. Authentication is handled through Replit Auth integration with session-based authentication.

### Backend Architecture
The server runs on Express.js with TypeScript, following a modular API structure. The application uses a service-oriented architecture with dedicated services for blockchain operations (Hedera), AI processing (OpenAI), and data persistence. Session management is implemented using PostgreSQL-backed sessions with Replit Auth for user authentication and authorization.

### Database Design
The system uses PostgreSQL with Drizzle ORM for database operations. The schema includes core entities for users, patents, patent documents, AI analysis results, prior art findings, blockchain transactions, and activity tracking. The database supports complex patent relationships and maintains audit trails for all patent-related activities.

### Blockchain Integration
Hedera blockchain integration provides immutable proof-of-existence for patent documents through the Hedera Consensus Service (HCS). Patent ownership is represented as NFTs using Hedera Token Service, enabling secure transfer and royalty management. The system calculates SHA-256 hashes of patent documents and stores them on-chain with timestamps for verification purposes.

### AI Service Integration
OpenAI integration powers multiple AI features including prior art searches, patent similarity detection, and automated patent drafting assistance. The AI service analyzes patent descriptions using natural language processing to identify semantic similarities and potential conflicts with existing patents.

### File Management
The application handles document uploads through Multer middleware with configurable storage limits. Patent documents are stored locally with metadata tracked in the database, and file hashes are generated for blockchain verification.

### Development Workflow
The project uses Vite for frontend development with hot module replacement and TypeScript compilation. The build process generates optimized production bundles for both frontend and backend components. Environment-based configuration supports development and production deployments.

## External Dependencies

### Blockchain Services
- **Hedera Hashgraph**: Provides consensus service for patent timestamping and token service for NFT-based ownership representation
- **Neon Database**: PostgreSQL database hosting for production deployments

### AI/ML Services
- **OpenAI API**: Powers prior art searches, patent analysis, similarity detection, and automated drafting assistance

### Authentication & Session Management
- **Replit Auth**: Handles user authentication and authorization through OpenID Connect
- **PostgreSQL Sessions**: Stores user sessions with configurable TTL

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives for complex UI elements

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the full stack
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Server-side bundling for production builds