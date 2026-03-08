# HRIS Frontend

![banner](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTFobHdmdDVoaHYzano3NjhjdXpzczd6Z2t5eDNvMXFmOGF0NWIyZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/El8u7R2MAgm5CCOzOD/giphy.gif)

## Overview

**Human Resource Information System (HRIS)** single-page application built with React 19 and TypeScript. It provides a comprehensive web interface for managing all core HR operations including employee management, attendance tracking, payroll processing, leave management, and role-based access control. The application communicates with a separate Laravel REST API backend.

---

## 📖 Technical Documentation

We have provided detailed documentation for every aspect of the system. Please click the links below:

| Document | Description |
| :--- | :--- |
| 📑 [**Overview**](./docs/frontend/overview.md) | Project vision, main features, and system modules. |
| 🏗️ [**Architecture**](./docs/frontend/architecture.md) | Design patterns, Service/Repository layers, and data flow. |
| 📂 [**Folder Structure**](./docs/frontend/folder-structure.md) | Detailed breakdown of the project directory organization. |
| 🔌 [**API Integration**](./docs/frontend/api-integration.md) | How the frontend communicates with the Laravel REST API. |
| 🪝 [**Hooks**](./docs/frontend/hooks.md) | Documentation for custom React hooks used in the project. |
| ⚙️ [**Setup Guide**](./docs/frontend/setup.md) | Environment installation steps and configuration. |
| 🧠 [**Context**](./docs/frontend/context.md) | Global state management using React Context API. |

---

## Features

- **Authentication & Account Activation** — Login, logout, forgot password, password reset, and secure account activation via email link
- **Role-Based Access Control (RBAC)** — Granular permission system (`index`, `create`, `edit`, `destroy`, `restore`, `approve`, `export`, etc.) enforced at the route level
- **Admin & Employee Dashboards** — Separate dashboard views based on user role
- **Employee Management** — Full CRUD with soft-delete/restore support, profile photos, biometric data, and employment termination
- **Attendance** — Bulk and single face-recognition-based attendance check-in via webcam with GPS geolocation
- **Attendance Report** — View and export attendance records with date range filtering
- **Leave Management** — Leave requests, early leave requests, and attendance correction requests with an approval workflow
- **Overtime Management** — Overtime request submission with multi-stage approval
- **Payroll Processing** — View, update, finalize, void, and download payroll slips as PDF
- **Work Schedules & Shifts** — Manage work schedule templates, shift templates, and assign them to employees
- **Holidays** — Public holiday calendar management
- **Allowances** — Salary allowance type management
- **Divisions & Positions** — Organisational structure management
- **Notifications** — In-app notification feed
- **Approval Workflow** — Centralised approval pages for Leave, Early Leave, Attendance Requests, and Overtime
- **Trash & Restore** — Soft-deleted records centralised under `/trash/*` routes
- **Settings** — System-level settings management
- **Calendar** — FullCalendar-powered event/schedule view
- **Landing Page** — Public-facing landing page with a Careers section
- **Dark Mode** — Full application dark mode with persistent theme preference

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5.7 |
| Build Tool | Vite 6 |
| Styling | TailwindCSS 4 (PostCSS) |
| Routing | React Router DOM 7 |
| Server State | TanStack React Query 5 |
| HTTP Client | Axios |
| UI Components | HeadlessUI, Lucide React |
| Charts | ApexCharts, React ApexCharts |
| Calendar | FullCalendar 6 (DayGrid, TimeGrid, List, Interaction) |
| Maps | Leaflet + React Leaflet + Leaflet Geosearch |
| Face Recognition | @vladmandic/face-api |
| Date Picker | Flatpickr |
| Slider | Swiper |
| Drag & Drop | React DnD + HTML5 Backend |
| Image Crop | React Easy Crop |
| File Upload | React Dropzone |
| Webcam | React Webcam |
| Toast Notifications | React Hot Toast |
| SEO | React Helmet Async |
| Linting | ESLint 9 + TypeScript ESLint |
| Package Manager | pnpm |

---

## Project Structure

```
FrontEnd/
├── public/                   # Static assets
├── src/
│   ├── api/                  # Axios API client + per-resource API modules (22 modules)
│   │   ├── axios.ts          # Axios instance with Bearer token interceptor
│   │   ├── auth.api.ts       # Authentication endpoints
│   │   ├── user.api.ts       # User / employee CRUD & utilities
│   │   ├── attendance.api.ts # Face recognition attendance
│   │   ├── payroll.api.ts    # Payroll management
│   │   └── ...               # One file per resource
│   ├── components/           # Reusable UI components
│   │   ├── auth/             # Auth form components
│   │   ├── charts/           # Chart wrappers
│   │   ├── common/           # Shared utilities (ScrollToTop, PageMeta, etc.)
│   │   ├── dashboard/        # Dashboard-specific widgets
│   │   ├── form/             # Reusable form inputs
│   │   ├── header/           # App header & user dropdown
│   │   ├── landing/          # Landing page components
│   │   ├── settings/         # Settings panel components
│   │   ├── skeleton/         # Loading skeleton screens
│   │   ├── tables/           # Data table components (one per resource)
│   │   └── ui/               # Design system primitives (Buttons, Modals, Badges, etc.)
│   ├── config/               # App-level configuration
│   ├── constants/            # Permission constants and resource names
│   │   ├── Permissions.ts    # RBAC permission action strings
│   │   └── Resource.ts       # Resource name identifiers
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx   # User session, permissions, auth actions
│   │   ├── ThemeContext.tsx  # Dark/light mode
│   │   ├── SettingsContext.tsx # App-level settings
│   │   ├── SidebarContext.tsx  # Sidebar open/close state
│   │   ├── TitleContext.tsx    # Page title provider
│   │   └── PageAlertContext.tsx
│   ├── hooks/                # Custom React hooks
│   ├── icons/                # SVG icon components
│   ├── layout/               # App shell layout (sidebar, header)
│   │   └── AppLayout.tsx
│   ├── pages/                # Route-level page components (33 feature directories)
│   │   ├── AuthPages/        # SignIn, FinalizeActivation, ForgotPassword, ResetPassword
│   │   ├── Dashboard/        # AdminDashboard, EmployeeDashboard
│   │   ├── Attendance/       # BulkFaceRecognition, SingleFaceRecognition
│   │   ├── AttendanceReport/
│   │   ├── AttendanceRequest/
│   │   ├── Leave/ & LeaveType/
│   │   ├── EarlyLeaves/
│   │   ├── Overtime/
│   │   ├── Payroll/
│   │   ├── User/             # CRUD pages for employees
│   │   ├── Roles/
│   │   ├── Division/ & Positions/ & Allowances/
│   │   ├── WorkSchedules/ & ShiftTemplate/ & EmployeeShift/ & EmployeeWorkSchedule/
│   │   ├── Holidays/
│   │   ├── Approval/         # Leave, EarlyLeave, AttendanceRequest, Overtime approvals
│   │   ├── Trash/            # Soft-delete recycle bin per resource
│   │   ├── Notification/
│   │   ├── Settings/
│   │   ├── Landing/          # Public landing page
│   │   ├── Careers/          # Job detail page
│   │   ├── Employee/         # Employee profile
│   │   └── Error/            # 403, 404, 500, 503 error pages
│   ├── providers/
│   │   └── AppServiceProviders.tsx  # Root provider composition
│   ├── routes/
│   │   ├── ProtectedRoute.tsx       # Redirects unauthenticated users to /login
│   │   └── PermissionRoute.tsx      # Guards routes based on user permissions
│   ├── types/                # TypeScript type definitions per domain
│   ├── utils/                # Helper utility functions
│   ├── App.tsx               # Root route definitions
│   └── main.tsx              # Application entry point
├── .env                      # Local environment variables
├── .env.example              # Environment variable template
├── vite.config.ts            # Vite + SVGR configuration
├── tsconfig.app.json         # TypeScript configuration
├── postcss.config.js         # PostCSS / TailwindCSS config
└── package.json
```

---

## Installation

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8 (recommended)  
  ```bash
  npm install -g pnpm
  ```
- A running instance of the **Laravel backend** (default: `http://localhost:8000`)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FrontEnd
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your backend URLs (see [Environment Variables](#environment-variables)).

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root. All variables must be prefixed with `VITE_` to be exposed to the client.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for all API requests (appended to every axios call) | `http://localhost:8000/api` |
| `VITE_BACKEND_URL` | Root backend URL (used for asset/media URLs) | `http://localhost:8000` |

> **Note:** Never store secrets or private keys in frontend environment variables — they are embedded in the browser bundle.

---

## Running the Application

### Development

```bash
pnpm dev
```

The Vite dev server starts with HMR on `http://localhost:5173`. Requests through ngrok tunnels are supported via the `allowedHosts: ['.ngrok-free.app']` configuration in `vite.config.ts`.

### Production Build

```bash
pnpm build
```

This runs `tsc -b` (type-check) followed by `vite build`. Output is placed in the `dist/` directory.

### Preview Production Build Locally

```bash
pnpm preview
```

### Linting

```bash
pnpm lint
```

---

## Queue / Worker

Not applicable — this is a pure frontend SPA. No background workers or schedulers exist in this repository. Background jobs (e.g., email dispatch, payroll calculation) are handled by the Laravel backend.

---

## API Documentation

All HTTP calls go through `src/api/axios.ts`. The Axios instance automatically attaches the Bearer token from `localStorage` and directs requests to `VITE_API_BASE_URL`.

### Authentication — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login with email & password; returns JWT token |
| `POST` | `/auth/logout` | Invalidate the current token |
| `GET`  | `/auth/me` | Fetch the authenticated user (with roles & permissions) |
| `POST` | `/auth/finalize-activation` | Set password on first-time account activation |
| `POST` | `/auth/resend-verification` | Resend the activation email |
| `POST` | `/auth/forgot-password` | Request a password-reset email |
| `GET`  | `/auth/reset-password/check` | Validate a password reset token |
| `POST` | `/auth/reset-password` | Submit new password with reset token |

### Users / Employees — `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/users` | List all users |
| `POST`   | `/users` | Create a new user |
| `GET`    | `/users/:uuid` | Get a single user |
| `PUT`    | `/users/:uuid` | Update a user |
| `DELETE` | `/users/:uuid` | Soft-delete a user |
| `GET`    | `/users/trashed` | List soft-deleted users |
| `POST`   | `/users/restore/:uuid` | Restore a soft-deleted user |
| `DELETE` | `/users/force-delete/:uuid` | Permanently delete a user |
| `PUT`    | `/users/terminate-employment/:uuid` | Mark user as resigned/terminated |
| `PUT`    | `/users/change-password/:uuid` | Admin change user password |
| `PUT`    | `/users/status/:uuid` | Toggle user active status |
| `POST`   | `/users/upload-profile-photo/:uuid` | Upload a profile photo |
| `GET`    | `/users/managers` | List users with manager role |
| `GET`    | `/users/employees-lite` | Lightweight employee list for dropdowns |
| `GET`    | `/users/profile` | Get the authenticated user's profile |
| `PUT`    | `/users/change-password` | Self-service password change |
| `PUT`    | `/users/update-biometric` | Update facial biometric descriptor |

### Attendance — `/api/attendance`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/attendance/bulk-send` | Submit bulk face-recognition attendance (FormData with photos + descriptors + GPS) |
| `POST` | `/attendance/single-send` | Submit individual attendance |
| `GET`  | `/attendances` | List attendances (filterable by `start_date`, `end_date`) |
| `GET`  | `/attendances/:id` | Get single attendance detail |
| `GET`  | `/attendances/export` | Export attendance as file (blob) |
| `GET`  | `/attendances/today` | Check today's attendance status (`absent` / `clocked_in` / `completed`) |

### Leave Management — `/api/leaves`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/leaves` | List all leave requests |
| `POST`   | `/leaves` | Submit a leave request |
| `PUT`    | `/leaves/:id` | Update a leave request |
| `DELETE` | `/leaves/:id` | Delete a leave request |
| `POST`   | `/leaves/:id/approve` | Approve a leave request |
| `POST`   | `/leaves/:id/reject` | Reject a leave request |

### Early Leaves — `/api/early-leaves`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/early-leaves` | List all early leave requests |
| `POST`   | `/early-leaves` | Submit an early leave request |
| `PUT`    | `/early-leaves/:id` | Update request |
| `DELETE` | `/early-leaves/:id` | Delete request |
| `POST`   | `/early-leaves/:id/approve` | Approve |
| `POST`   | `/early-leaves/:id/reject` | Reject |

### Attendance Requests — `/api/attendance-requests`

Correction requests for missed/incorrect punch-ins — same approve/reject pattern as leaves.

### Overtime — `/api/overtimes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/overtimes` | List overtime requests |
| `POST`   | `/overtimes` | Submit overtime request |
| `PUT`    | `/overtimes/:id` | Update request |
| `DELETE` | `/overtimes/:id` | Delete request |
| `POST`   | `/overtimes/:id/approve` | Approve |
| `POST`   | `/overtimes/:id/reject` | Reject |

### Payroll — `/api/payrolls`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/payrolls` | List payroll records |
| `GET`  | `/payrolls/:uuid` | Get payroll detail |
| `PUT`  | `/payrolls/:uuid` | Update payroll |
| `PUT`  | `/payrolls/:uuid/finalize` | Finalize/lock a payroll |
| `PUT`  | `/payrolls/:uuid/void` | Void a payroll with note |
| `GET`  | `/payrolls/:uuid/download` | Download payroll slip as PDF |

### Other Resources

All following resources follow the same standard CRUD pattern (`GET /`, `POST /`, `PUT /:id`, `DELETE /:id`) with soft-delete support where applicable:

| Resource | Base Endpoint |
|----------|---------------|
| Roles | `/roles` |
| Divisions | `/divisions` |
| Positions | `/positions` |
| Allowances | `/allowances` |
| Holidays | `/holidays` |
| Work Schedules | `/work-schedules` |
| Shift Templates | `/shift-templates` |
| Employee Work Schedules | `/employee-work-schedules` |
| Employee Shifts | `/employee-shifts` |
| Leave Types | `/leave-types` |
| Notifications | `/notifications` |
| Settings | `/settings` |
| Dashboard | `/dashboard` |

---

## Database

This frontend does not directly interact with a database. All data persistence is handled by the **Laravel backend**. Database migrations, seeders, and schema definitions reside in the backend repository.

The frontend expects the backend to expose a JSON REST API and use **Laravel Sanctum** (or a similar token-based approach) for authentication using Bearer tokens stored in `localStorage`.

---

## Development Workflow

1. **Start the backend** Laravel server (ensure it runs on the port specified in `VITE_API_BASE_URL`).
2. **Start the frontend** dev server with `pnpm dev`.
3. **Coding conventions:**
   - All API calls are centralised in `src/api/*.api.ts` files — one file per resource.
   - Use **TanStack React Query** (`useQuery` / `useMutation`) for all server state — avoid local state for data fetched from the API.
   - Route-level permissions are enforced by `PermissionRoute` using `buildPermission(resource, action)` — add new protected routes in `App.tsx` the same way.
   - Use the `@/` path alias (resolves to `src/`) in all imports.
   - New UI primitives go in `src/components/ui/`.
   - New page-level table components go in `src/components/tables/<ResourceName>/`.
4. **Commit guidelines:** Not clearly defined in the repository.

---

## Deployment

1. **Set environment variables** for the production backend:
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   VITE_BACKEND_URL=https://api.yourdomain.com
   ```

2. **Build the production bundle:**
   ```bash
   pnpm build
   ```

3. **Serve the `dist/` folder** using any static file server or CDN (e.g., Nginx, Vercel, Netlify, Cloudflare Pages).

   **Nginx example** (with React Router support):
   ```nginx
   server {
     listen 80;
     root /var/www/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. Ensure the backend CORS configuration whitelists your frontend's production domain.

> **Ngrok support:** The Vite dev server already allows `*.ngrok-free.app` hosts. For production, use a proper domain instead.

---

## License

See [LICENSE.md](./LICENSE.md) for license details.
