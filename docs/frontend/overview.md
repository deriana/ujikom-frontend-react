# Frontend Overview

## Project Purpose

This is the frontend application for an **HRIS (Human Resource Information System)** built as part of the Ujikom project. It provides a web-based dashboard for managing employees, attendance, payroll, leave, shifts, and more.

## Main Features

- **Authentication** – Login, logout, password reset, and account activation
- **Employee Management** – Create, update, and manage employee profiles and biometric data
- **Attendance Tracking** – Record and review attendance (single and bulk), with export support
- **Leave & Early Leave Management** – Submit and approve leave/early leave requests
- **Overtime Management** – Record and manage employee overtime
- **Payroll** – View and manage payroll records
- **Shift & Work Schedule** – Assign shift templates and work schedules to employees
- **Notifications** – In-app notification system
- **Role & Permission Management** – Granular access control via roles and permissions
- **Dashboard & Charts** – Summary statistics and data visualizations
- **Theme Support** – Light and dark mode

## Key Technologies

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| TailwindCSS 4 | Styling |
| Axios | HTTP client for API communication |
| TanStack Query (React Query) | Server state management and caching |
| React Router v7 | Client-side routing |
| React Context API | Global/shared state management |
| Lucide React | Icon library |
| ApexCharts | Data visualization |
| FullCalendar | Calendar UI |
| React Hot Toast | Toast notifications |

## Frontend ↔ Backend Interaction

The frontend communicates with a **Laravel-based REST API** backend via Axios. All API requests are made through a centralized Axios instance configured with:

- A base URL from the environment variable `VITE_API_BASE_URL`
- Automatic `Bearer` token injection for authenticated requests
- Response interceptors for handling `401 Unauthorized` errors (auto token removal)

The backend URL is set with `VITE_BACKEND_URL` and media/file assets may be served directly from the backend origin.
