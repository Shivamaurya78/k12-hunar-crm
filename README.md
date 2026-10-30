# K12 Hunar CRM

A full-stack Customer Relationship Management (CRM) application built to collect, manage, and track inquiries from parents, students, and schools.

## Live Demo

- **Frontend:** https://k12-hunar-crm-three.vercel.app
- **Backend:** https://k12-hunar-crm-backend.onrender.com
- **Health Check:** https://k12-hunar-crm-backend.onrender.com/api/health

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- Maven

### Database & Deployment
- PostgreSQL (Supabase)
- Docker
- Render (Backend)
- Vercel (Frontend)
- GitHub

## Project Structure

```text
k12-hunar-crm/
├── crm-frontend/
│   └── React application
├── crm-backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── schema.sql
├── .env.example
├── .gitignore
└── README.md
```

## Features

- Submit inquiries through a public inquiry form.
- Store inquiry information in PostgreSQL.
- Admin login using JWT authentication.
- View and manage submitted inquiries.
- Filter inquiries by category and user type.
- Search inquiries.
- Update inquiry status.
- Protected admin APIs.

## Inquiry Information

Supported user types:
- PARENT
- STUDENT
- SCHOOL

Supported categories:
- SCHOLARSHIP
- CONCERT
- ADMISSION
- GENERAL_QUERY

Supported inquiry statuses:
- NEW
- CONTACTED
- RESOLVED

## Database Setup

This project uses PostgreSQL hosted on Supabase.

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Copy the SQL statements from `schema.sql`.
4. Execute the statements to create the required tables.

The application uses these tables:

- `public.inquiries`
- `public.admins`

## Environment Variables

Create the required environment variables using `.env.example` as a reference.

### Backend Environment Variables

| Variable | Description |
|---|---|
| DB_URL | PostgreSQL JDBC connection URL |
| DB_USERNAME | Database username |
| DB_PASSWORD | Database password |
| JWT_SECRET | Base64-encoded JWT signing secret |
| ADMIN_EMAIL | Initial admin email for seeding |
| ADMIN_PASSWORD | Initial admin password for seeding |
| PORT | Backend server port |
| FRONTEND_URL | Allowed frontend origin for CORS |

### Frontend Environment Variable

| Variable | Description |
|---|---|
| VITE_API_URL | Backend API base URL |

Never commit real passwords, database credentials, or JWT secrets to GitHub.

## Run Locally

### Prerequisites

- Java 21 or later
- Node.js and npm
- PostgreSQL / Supabase database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Shivamaurya78/k12-hunar-crm.git
cd k12-hunar-crm
```

### 2. Configure the backend

Open the `crm-backend` directory.

Set the required backend environment variables in your terminal or development environment.

On Windows PowerShell, for example:

```powershell
$env:DB_URL="jdbc:postgresql://YOUR_HOST:5432/postgres?sslmode=require"
$env:DB_USERNAME="YOUR_DATABASE_USERNAME"
$env:DB_PASSWORD="YOUR_DATABASE_PASSWORD"
$env:JWT_SECRET="YOUR_BASE64_SECRET"
$env:ADMIN_EMAIL="YOUR_ADMIN_EMAIL"
$env:ADMIN_PASSWORD="YOUR_ADMIN_PASSWORD"
$env:PORT="8080"
$env:FRONTEND_URL="http://localhost:5173"
```

Run the backend:

```powershell
cd crm-backend
.\mvnw.cmd spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Configure the frontend

Open another terminal:

```bash
cd crm-frontend
npm install
```

Create a `.env` file inside `crm-frontend`:

```dotenv
VITE_API_URL=http://localhost:8080/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API Endpoints

Base URL:

```text
http://localhost:8080/api
```

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Backend health check |
| POST | `/auth/login` | Public | Admin login |
| POST | `/inquiries` | Public | Submit an inquiry |
| GET | `/inquiries` | JWT required | Retrieve inquiries |
| PATCH | `/inquiries/{id}/status?status=CONTACTED` | JWT required | Update inquiry status |

### Submit an Inquiry

**POST** `/api/inquiries`

Example JSON:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "userType": "PARENT",
  "category": "GENERAL_QUERY",
  "message": "This is a test inquiry."
}
```

### Admin Login

**POST** `/api/auth/login`

Example JSON:

```json
{
  "email": "admin@example.com",
  "password": "YOUR_ADMIN_PASSWORD"
}
```

The login API returns a JWT token when authentication succeeds.

### Access Protected APIs

Include the returned token in the Authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```text
GET /api/inquiries
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Inquiry Status

**PATCH** `/api/inquiries/{id}/status?status=RESOLVED`

Include the JWT Bearer token in the request headers.

## JWT Authentication

- Admin credentials are verified by the backend.
- Passwords are stored using BCrypt hashing.
- Successful login returns a JWT token.
- Protected inquiry endpoints require a valid Bearer token.
- JWT signing uses the configured Base64 secret.

## Deployment

- Frontend is deployed on Vercel.
- Backend is deployed on Render using Docker.
- PostgreSQL database is hosted on Supabase.
- Environment variables are configured through the respective deployment dashboards.

## Security Notes

- Never expose database passwords or JWT secrets in source code.
- Do not commit `.env` files.
- Use strong admin credentials.
- Configure the production frontend origin in `FRONTEND_URL`.
- Keep deployment credentials in the hosting platform's environment settings.

## Author

**Shiva Maurya**

GitHub: https://github.com/Shivamaurya78

Repository: https://github.com/Shivamaurya78/k12-hunar-crm