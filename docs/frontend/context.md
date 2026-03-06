# React Context

React Context is used exclusively for **global UI and authentication state** — data that needs to be shared across the entire application without prop drilling.

All context providers are composed at the application root in `src/main.tsx` or `src/App.tsx`.

---

## `AuthContext` — Authentication & Permissions

**Source:** `src/context/AuthContext.tsx`

**Purpose:** Manages the currently authenticated user, their loaded permissions, and all auth-related actions (login, logout, password reset, etc.).

### State

| Property | Type | Description |
|---|---|---|
| `user` | `User \| null` | Currently authenticated user object |
| `loading` | `boolean` | `true` while fetching the current user on app load |
| `permissions` | `string[]` | Flat array of permission names from the user's roles |

### Actions

| Action | Signature | Description |
|---|---|---|
| `login` | `(email, password) => Promise<void>` | Authenticate and load user |
| `logout` | `() => Promise<void>` | Call logout API and clear state |
| `refreshUser` | `() => Promise<void>` | Re-fetch the current user from the API |
| `forgotPassword` | `(email) => Promise<void>` | Send a password reset email |
| `checkResetToken` | `(token) => Promise<any>` | Validate a password reset token |
| `resetPassword` | `(payload) => Promise<void>` | Set a new password using the reset token |
| `finalizeActivation` | `(payload) => Promise<void>` | Complete initial account activation |
| `resendActivation` | `(email) => Promise<void>` | Resend the activation email |

### How Permissions Are Loaded

On `refreshUser`, the user's roles and their nested permissions are flattened into a single `string[]` array:

```ts
const perms = me.roles?.flatMap((role) =>
  role.permissions.map((p) => p.name)
) ?? [];
```

### Provider Setup

```tsx
// src/main.tsx (or App.tsx)
<AuthProvider>
  <App />
</AuthProvider>
```

### Accessing Auth State

Use the `useAuth` hook:

```tsx
import { useAuth } from "@/hooks/useAuth";

const { user, login, logout, permissions } = useAuth();
```

---

## `ThemeContext` — Light / Dark Mode

**Source:** `src/context/ThemeContext.tsx`

**Purpose:** Tracks and persists the current UI theme (`"light"` or `"dark"`). Persisted in `localStorage` and applied via a CSS class on `document.documentElement`.

### Interface

```ts
type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};
```

### Usage

```tsx
import { useTheme } from "@/context/ThemeContext";

const { theme, toggleTheme } = useTheme();
```

---

## `SidebarContext` — Sidebar Navigation State

**Source:** `src/context/SidebarContext.tsx`

**Purpose:** Manages the sidebar expansion state, mobile drawer state, active navigation item, and open submenu.

### Interface

```ts
type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (value: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
};
```

### Usage

```tsx
import { useSidebar } from "@/context/SidebarContext";

const { isExpanded, toggleSidebar } = useSidebar();
```

---

## Other Contexts

| Context | Source | Purpose |
|---|---|---|
| `PageAlertContext` | `PageAlertContext.tsx` | Show/hide page-level alert banners |
| `SettingsContext` | `SettingsContext.tsx` | Application-level settings (e.g., company info) |
| `TitleContext` | `TitleContext.tsx` | Dynamic page title management |

---

## Summary

| Context | Global State |
|---|---|
| `AuthContext` | User identity, roles, permissions, auth actions |
| `ThemeContext` | Light/dark theme |
| `SidebarContext` | Sidebar UI state |
| `SettingsContext` | App settings |
| `PageAlertContext` | Page-level alerts |
| `TitleContext` | Page titles |
