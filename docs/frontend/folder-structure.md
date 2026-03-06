# Folder Structure

```
src/
 ├── api/
 ├── components/
 ├── config/
 ├── constants/
 ├── context/
 ├── hooks/
 ├── icons/
 ├── layout/
 ├── pages/
 ├── providers/
 ├── routes/
 ├── types/
 ├── utils/
 ├── App.tsx
 ├── main.tsx
 └── index.css
```

---

## Directory Reference

### `api/`
Contains all Axios-based API call functions, one file per resource domain.

- `axios.ts` — Shared Axios instance (base URL, interceptors)
- `auth.api.ts`, `user.api.ts`, `attendance.api.ts`, ... — Resource-specific API functions

> These are pure async functions. They are never called directly from components.

---

### `components/`
Reusable UI building blocks used across multiple pages.

Examples: tables, modals, form inputs, buttons, badges, dropdowns, file uploaders, charts.

---

### `config/`
Static configuration files used across the application.

Examples: navigation menu definitions, route configurations.

---

### `constants/`
Application-wide constant values.

Examples: status enums, default values, label maps.

---

### `context/`
React Context providers for shared global state.

| File | State Managed |
|---|---|
| `AuthContext.tsx` | User auth state and permissions |
| `ThemeContext.tsx` | Light/dark theme |
| `SidebarContext.tsx` | Sidebar navigation state |
| `SettingsContext.tsx` | Application settings |
| `PageAlertContext.tsx` | Page-level alerts |
| `TitleContext.tsx` | Dynamic page titles |

---

### `hooks/`
Custom React hooks. Each hook wraps either a React Query query/mutation or provides reusable stateful logic.

Examples: `useAuth`, `useUsers`, `useAttendances`, `useCrudModalForm`, `useCan`

---

### `icons/`
Custom SVG icon components used throughout the UI.

---

### `layout/`
Application shell components that form the outer frame of the authenticated dashboard.

Examples: `AppLayout`, `Sidebar`, `Header`, `PageMeta`

---

### `pages/`
Route-level view components. Each subdirectory corresponds to a feature or route group.

| Directory | Feature |
|---|---|
| `AuthPages/` | Login, forgot password, account activation |
| `Dashboard/` | Main dashboard overview |
| `Employee/` | Employee management |
| `Attendance/` / `Attendances/` | Attendance tracking |
| `Leave/` | Leave management |
| `EarlyLeaves/` | Early leave requests |
| `Overtime/` | Overtime management |
| `Payroll/` | Payroll records |
| `Roles/` | Roles and permissions |
| `Division/` | Divisions |
| `Positions/` | Job positions |
| `ShiftTemplate/` | Shift templates |
| `WorkSchedules/` | Work schedules |
| `Holidays/` | Public holidays |
| `Notification/` | Notification center |
| `Settings/` | System settings |
| `Careers/` | Careers/job listings page |
| `Landing/` | Public landing page |
| `Trash/` | Soft-deleted records |
| `Error/` | 404, 403, 500 error pages |

---

### `providers/`
Composition of all context providers into a single wrapper component applied at the app root.

---

### `routes/`
React Router route definitions and protected route guards.

---

### `types/`
TypeScript type definitions and interfaces, organized by domain.

Examples: `auth.types.ts`, `user.types.ts`, `attendance.types.ts`

---

### `utils/`
Shared utility functions.

Examples:
- `handleMutation.ts` — Wraps TanStack mutations with toast feedback (loading/success/error)
- `permission.ts` — `can()` helper for permission checking
- Date/time formatters, class name utilities, etc.
