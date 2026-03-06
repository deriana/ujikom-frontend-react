# API Integration

## Axios Configuration

All API communication is handled through a **shared Axios instance** defined in `src/api/axios.ts`.

```ts
// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;
```

---

## Request Interceptor — Authorization Headers

Before every request, the interceptor reads the JWT token from `localStorage` and attaches it as a `Bearer` token:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Required when tunneling via ngrok
  config.headers["ngrok-skip-browser-warning"] = "69420";

  return config;
});
```

---

## Response Interceptor — Error Handling

The response interceptor handles common HTTP error scenarios:

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid – remove from storage
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);
```

| Status Code | Behavior |
|---|---|
| `401` | Removes auth token from `localStorage` |

---

## Token Handling

- Tokens are stored in `localStorage` under the key `"token"`
- Injected automatically into every request via the request interceptor
- Cleared automatically on `401` response

---

## API Modules

Each resource domain has its own API module in `src/api/`:

| File | Resource |
|---|---|
| `auth.api.ts` | Login, logout, password reset, activation |
| `user.api.ts` | Employee/user CRUD, biometrics, profile |
| `attendance.api.ts` | Attendance records and export |
| `attendanceRequest.api.ts` | Attendance correction requests |
| `leave.api.ts` | Leave management |
| `earlyLeave.api.ts` | Early leave requests |
| `overtime.api.ts` | Overtime records |
| `payroll.api.ts` | Payroll data |
| `division.api.ts` | Division management |
| `position.api.ts` | Position management |
| `role.api.ts` | Roles and permissions |
| `shiftTemplate.api.ts` | Shift templates |
| `workSchedule.api.ts` | Work schedules |
| `holiday.api.ts` | Public holidays |
| `notification.api.ts` | Notifications |
| `dashboard.api.ts` | Dashboard summary data |
| `setting.api.ts` | Application settings |

---

## Making Requests Inside Hooks

API functions are never called directly from components. They are wrapped in **custom hooks** using TanStack React Query:

```ts
// src/api/user.api.ts
export const getUser = async () => {
  const { data } = await api.get("/users");
  return data;
};

// src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user.api";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
  });
};
```

Components then consume the hook:

```tsx
const { data: users, isLoading } = useUsers();
```
