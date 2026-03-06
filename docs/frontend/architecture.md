# Frontend Architecture

## Overview

The frontend follows a **feature-based layered architecture** with clear separation between UI, state management, API communication, and utility logic.

---

## Component Structure

Components are organized by feature and responsibility:

- **`pages/`** – Full-page route views (e.g., `Dashboard`, `Employee`, `Attendance`)
- **`components/`** – Reusable UI components (tables, modals, form inputs, cards)
- **`layout/`** – Application shell components (sidebar, header, main layout)
- **`icons/`** – SVG icon components

Pages compose components; components are kept generic and reusable.

---

## State Management Strategy

State is split into two layers:

| Layer | Technology | Purpose |
|---|---|---|
| **Server state** | TanStack React Query | Fetching, caching, and syncing API data |
| **Global UI state** | React Context API | Auth, theme, sidebar, settings, notifications |

This prevents unnecessary global state for server data while keeping shared UI state accessible everywhere.

---

## Separation of Concerns

```
src/
 ├── api/         ← All Axios API calls (pure functions)
 ├── hooks/       ← Custom hooks wrapping React Query + API functions
 ├── context/     ← React Context providers (global state)
 ├── pages/       ← Route-level views (consume hooks and components)
 ├── components/  ← Reusable UI building blocks
 ├── types/       ← TypeScript types and interfaces
 └── utils/       ← Shared utilities (permission checks, mutation helpers)
```

---

## API Layer Design

All backend communication is isolated in the `src/api/` directory. Each API module corresponds to a resource domain:

- `axios.ts` — Shared Axios instance (base URL, token injection, error interception)
- `auth.api.ts` — Authentication endpoints
- `user.api.ts` — User/employee CRUD
- `attendance.api.ts` — Attendance tracking
- *(and more per resource...)*

API modules export **plain async functions** — they are never called directly from components. Instead, they are wrapped in custom hooks.

---

## Request Flow

```
UI Component
    │
    ▼
Custom Hook (useXxx)
    │  TanStack Query (useQuery / useMutation)
    ▼
API Module (xxx.api.ts)
    │  Axios instance
    ▼
Backend REST API
```

---

## Reusable Components

Key reusable components include:

- **Tables** – Sortable, paginated data tables
- **Modals** – Shared modal wrapper for CRUD dialogs
- **Form Inputs** – Text, select, date pickers, file upload
- **Charts** – ApexCharts wrappers for dashboard metrics

---

## Hooks Usage

Custom hooks are the primary interface between UI and data:

- **Query hooks** (e.g., `useUsers`, `useAttendances`) — wrap `useQuery` for data fetching
- **Mutation hooks** (e.g., `useCreateUser`, `useDeleteUser`) — wrap `useMutation` with optimistic updates
- **Form hooks** (e.g., `useCrudModalForm`) — manage modal open/close, form state, and submit logic
- **Auth hooks** (e.g., `useAuth`, `useCan`) — access authentication state and permission checks
