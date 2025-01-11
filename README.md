# School Management System

A comprehensive school management system built with Next.js and NestJS.

## Features

- Role-based access control (Student, Parent, Teacher, Admin, Super Admin)
- Fee management and payment tracking
- Attendance management
- Exam scheduling
- Extra curriculum activities
- Class and subject management
- User authentication with JWT
- First-time login password change requirement
- Admin password reset capabilities
- Swagger API documentation

## Tech Stack

- Frontend: Next.js 14 with App Router, TypeScript, Tailwind CSS
- Backend: NestJS, TypeORM, SQLite
- Authentication: JWT with role-based guards
- Documentation: Swagger/OpenAPI

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install
   ```
3. Set up environment variables
4. Run migrations
5. Start the development servers

## API Documentation

Access the Swagger documentation at `/api` endpoint when running the backend server.
