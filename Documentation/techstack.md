# Tech Stack — Farm Problem Reporting & Expert Response System

## 1. Project Overview

A responsive web application that enables farmers to report agricultural problems, upload crop photographs, track report status, and receive guidance from agriculture experts. Administrators manage users, categories, and report assignments.

The application supports three roles:
- **Farmer:** Submit and track agricultural problems.
- **Agriculture Expert:** Review assigned reports and provide recommendations.
- **Admin:** Manage users, categories, assignments, and system activity.

## 2. Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and build tooling |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable and accessible UI components |
| React Router | Client-side routing |
| TanStack Query | API data fetching, caching, and synchronization |
| Axios | HTTP requests to the backend |
| React Hook Form | Form management |
| Zod | Input validation |
| Recharts | Dashboard charts and statistics |
| Lucide React | Icons |
| Sonner | Toast notifications |

### Frontend Requirements
- Responsive layouts for desktop, tablet, and mobile.
- Separate dashboards for farmers, experts, and administrators.
- Reusable components and consistent design tokens.
- Loading, empty, success, and error states.
- Form validation with clear error messages.
- Accessible controls and keyboard navigation.

## 3. Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe backend development |
| Mongoose | MongoDB object modeling |
| Zod | Request validation |
| bcrypt | Password hashing |
| JSON Web Tokens (JWT) | Authentication tokens |
| Helmet | HTTP security headers |
| CORS | Controlled cross-origin requests |
| express-rate-limit | Rate limiting |
| Multer | Multipart upload handling, if required by the upload flow |
| Pino or Winston | Application logging |

### Backend Requirements
- RESTful API architecture.
- Authentication and role-based authorization.
- Server-side validation of all important inputs.
- Centralized error-handling middleware.
- Secure password storage.
- Pagination, filtering, and sorting for report lists.
- Environment-based configuration.
- Authorization checks on every protected resource.

## 4. Database and File Storage

### MongoDB Atlas
Use MongoDB Atlas as the managed database service.

Recommended collections:
- `users`
- `reports`
- `categories`
- `responses`
- `notifications`
- `auditLogs`

Reports should store fields such as:
- Report title and description.
- Crop and problem category.
- Farmer ID.
- Location details.
- Image metadata and URLs.
- Assigned expert ID.
- Current status.
- Creation and update timestamps.

Use Mongoose schemas, indexes, and references where appropriate.

### Cloudinary
Use Cloudinary for uploaded crop photographs.

- Validate image type and file size.
- Upload images through a protected backend flow.
- Store image URLs and relevant metadata in MongoDB.
- Keep API secrets in environment variables.
- Restrict upload permissions and avoid trusting client-provided URLs.

## 5. Authentication and Authorization

Implement secure authentication using JWT and bcrypt.

### Roles
- `farmer`
- `expert`
- `admin`

### Authorization Rules
- Farmers can create reports and access only their own reports.
- Experts can access reports assigned to them and submit expert responses.
- Admins can manage users, categories, assignments, and authorized administrative functions.
- Only authorized users can change report status.
- All role and ownership checks must be enforced by the backend.

For browser authentication, prefer secure, `HttpOnly`, `Secure` cookies with an appropriate `SameSite` policy where supported. If cookies are used, implement suitable CSRF protection. Never store passwords or sensitive credentials in frontend code.

## 6. Report Workflow

Recommended report statuses:

1. `Submitted`
2. `Assigned`
3. `Under Review`
4. `More Information Required`
5. `Responded`
6. `Resolved`

The backend must validate permitted status transitions and record relevant timestamps and status history.

## 7. Similar Solved Problems

Implement a feature that helps experts find previously resolved reports relevant to the current case.

### Initial Implementation
- Match crop type.
- Match problem category.
- Search relevant description keywords.
- Display similar resolved reports and their expert responses.
- Allow the expert to open a previous report for context.

Similarity results are references for expert review, not automatic diagnoses. Experts remain responsible for their recommendations.

A more advanced semantic-search or AI-assisted matching feature may be added in a future version.

## 8. API Design

Use a versioned REST API with the base path:

`/api/v1`

Suggested endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register an account where permitted |
| POST | `/auth/login` | Authenticate a user |
| POST | `/auth/logout` | Log out |
| GET | `/auth/me` | Get the current user |
| GET | `/reports` | List authorized reports |
| POST | `/reports` | Submit a report |
| GET | `/reports/:id` | View an authorized report |
| PATCH | `/reports/:id` | Update permitted report fields |
| POST | `/reports/:id/images` | Upload report photographs |
| POST | `/reports/:id/assign` | Assign an expert |
| POST | `/reports/:id/responses` | Add an expert response |
| PATCH | `/reports/:id/status` | Update report status |
| GET | `/reports/:id/similar` | Find similar resolved reports |
| GET | `/categories` | List problem categories |
| POST | `/categories` | Create a category; admin only |
| GET | `/admin/users` | Manage user listings; admin only |
| GET | `/admin/analytics` | Retrieve administrative statistics |

These endpoints are the proposed API contract. Implement request validation, response formats, authentication, authorization, and error handling consistently.

## 9. Development Tools

| Tool | Purpose |
|---|---|
| Visual Studio Code | Code editor |
| Git | Version control |
| GitHub | Source-code repository |
| Postman | API testing |
| MongoDB Atlas | Managed database |
| npm | Package management |
| ESLint | Code-quality checks |
| Prettier | Code formatting |
| Vitest | Unit and component tests |
| React Testing Library | Frontend interaction tests |
| Supertest | Backend API integration tests |

## 10. Deployment

| Component | Recommended Service |
|---|---|
| Frontend | Vercel |
| Backend API | Render or Railway |
| Database | MongoDB Atlas |
| Image storage | Cloudinary |
| Source code | GitHub |

Configure environment variables separately for development and production. Confirm current hosting limits before relying on free tiers.

## 11. Environment Variables

Example backend `.env.example`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Example frontend `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Do not commit actual credentials, private keys, production secrets, or populated `.env` files to GitHub. Frontend variables prefixed with `VITE_` must never contain secrets.

## 12. Suggested Project Structure

```text
farm-problem-system/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── routes/
│   │   └── types/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── docs/
├── .gitignore
├── README.md
└── techstack.md
```

## 13. Implementation Priorities

### Phase 1 — Foundation
- Initialize frontend and backend.
- Configure TypeScript, Tailwind CSS, and MongoDB.
- Define schemas, API conventions, and error handling.

### Phase 2 — Authentication
- Implement login and account creation.
- Add secure password hashing and authorization middleware.
- Build role-specific route protection.

### Phase 3 — Core Reporting
- Create and view reports.
- Upload crop photographs.
- Implement report listing, filtering, and status tracking.

### Phase 4 — Expert and Admin Workflows
- Assign reports to experts.
- Implement expert responses and follow-ups.
- Build administrative user and category management.

### Phase 5 — Additional Features
- Add similar solved problems.
- Build charts and notification interfaces.
- Add audit history for important administrative actions.

### Phase 6 — Testing and Deployment
- Test authorization and report ownership.
- Test upload validation and error handling.
- Deploy the frontend and backend.
- Configure production environment variables.
- Verify the application on mobile and desktop.

## 14. Scope Guidelines

For the initial version, prioritize reporting, photo uploads, assignment, expert responses, status tracking, and role-based dashboards.

Keep real-time chat, AI-based crop diagnosis, maps, and advanced notifications as optional extensions unless time permits. Any agricultural recommendations must be reviewed by a qualified expert rather than presented as guaranteed diagnoses.

## 15. Final Technology Summary

**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui

**Backend:** Node.js, Express.js, TypeScript

**Database:** MongoDB Atlas, Mongoose

**Authentication:** JWT, bcrypt, role-based authorization

**File Storage:** Cloudinary

**Testing:** Vitest, React Testing Library, Supertest, Postman

**Deployment:** Vercel, Render or Railway, MongoDB Atlas, Cloudinary

**Architecture:** Modular full-stack application using a versioned REST API.
