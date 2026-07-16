# EmployeeHub

A scalable Employee Management System monorepo with a React/Vite frontend and an Express/MongoDB API.

## Included foundation

- JWT authentication and ten default role constants
- Role-based API authorization, Zod validation, repository/service/controller layering
- Employee list/create/update APIs with organization scoping and pagination
- Security headers, CORS, rate limiting, structured logging and centralized errors
- Swagger UI at `/docs`, Socket.IO server, health endpoint at `/health`
- Responsive React dashboard, protected routing, Redux Toolkit Query, React Hook Form, TanStack Table, Recharts, Framer Motion and Lucide icons
- Docker Compose and GitHub Actions CI

## Start locally

1. Copy `backend/.env.example` to `backend/.env` and fill the required secrets.
2. Start MongoDB (or run `docker compose up mongo`).
3. Run `npm install` from the repository root.
4. Run `npm run seed -w @employeehub/api` to create the local administrator.
5. Run `npm run dev`.

Open `http://localhost:5173`. The local seed credentials are `admin@employeehub.local` / `Admin@123`. Change them immediately outside local development.

## Architecture

The API separates configuration, modules, models, repositories, services, controllers, validation, middleware, routes, jobs and utilities under `backend/src`. The frontend lives in `frontend/src`, with feature folders, centralized routes, typed Redux hooks and RTK Query API access.

Production integrations (Cloudinary/S3, SMTP/SendGrid, Redis queues and scheduled payroll/attendance jobs) intentionally require provider credentials and should be added behind service interfaces.
# employee_management_system

