# NestJS Seed Project: Clean Architecture, DDD, CQRS & Event-Driven

This is a robust backend seed project built with [NestJS](https://nestjs.com/), incorporating advanced software engineering principles including Clean Architecture, Domain-Driven Design (DDD), Event-Driven architecture (via CQRS), and SOLID principles.

## 🚀 Features included

1. **Clean Architecture & DDD**
   - **Core/Domain**: Entities, Aggregates, Value Objects, and Domain Events.
   - **Application**: Use Cases implemented through Commands and Queries (CQRS). Ports (Interfaces) for external dependencies.
   - **Infrastructure**: Implementations of Ports (TypeORM repositories, JWT strategy, Bcrypt hashing, Email Service).
   - **Presentation**: REST API Controllers and DTOs with validation.

2. **Event-Driven Architecture (CQRS)**
   - Utilizes `@nestjs/cqrs` for Command and Query dispatching.
   - Domain events are dispatched and handled asynchronously (e.g., `UserRegisteredEvent`).

3. **Authentication & Authorization**
   - **JWT Auth**: Asymmetric encryption using RSA Public/Private Key pairs.
   - **RBAC (Role-Based Access Control)**: Guard and Decorators built-in.
   - **Direct & Role Permissions**: Permissions can be inherited from Roles or assigned directly to Users.
   - **Password Recovery**: Secure password reset flow using tokens and an external API port.

## 📂 Project Structure

\`\`\`
src/
├── core/
│   └── domain/                 # Base classes (Entity, Domain Events)
├── iam/                        # Identity and Access Management Module
│   ├── domain/                 # Entities (User, Role, Permission) & Repository Ports
│   ├── application/            # Use cases (Commands, Queries, Event Handlers)
│   ├── infrastructure/         # DB Repositories, Security (Bcrypt, JWT), External APIs
│   ├── presentation/           # Controllers (Auth, Roles, Users), DTOs
│   └── iam.module.ts           # IAM Module definition
├── app.module.ts               # Root module
└── main.ts                     # App entry point (Swagger config, Validation pipes)
\`\`\`

## 🛠 Setup & Run

1. Make sure you have PostgreSQL running and update the \`.env\` file with your credentials.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run start:dev
   \`\`\`

## 📚 API Documentation

Swagger is configured by default. Once the server is running, visit:
\`http://localhost:3000/api\`
