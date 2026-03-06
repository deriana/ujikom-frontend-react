# Custom React Hooks

All hooks live in `src/hooks/`. They wrap TanStack React Query (`useQuery` / `useMutation`) around API functions or encapsulate reusable UI logic.

---

## `useAuth`

**Purpose:** Access the global authentication context.

**Source:** `src/hooks/useAuth.ts`

```ts
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => useContext(AuthContext);
```

**Returns:** The full `AuthContextType` — `user`, `loading`, `permissions`, `login`, `logout`, `refreshUser`, `forgotPassword`, `resetPassword`, etc.

**Usage:**

```tsx
const { user, login, logout } = useAuth();
```

---

## `useCan`

**Purpose:** Check if the current user has a specific permission.

**Source:** `src/hooks/useCan.ts`

**Parameters:**

| Name | Type | Description |
|---|---|---|
| `permission` | `string` | Permission name to check (e.g., `"user.create"`) |

**Returns:** `boolean`

**Usage:**

```tsx
const canCreateUser = useCan("user.create");

if (canCreateUser) {
  return <CreateUserButton />;
}
```

---

## `useUsers` / `useCreateUser` / `useUpdateUser` / `useDeleteUser`

**Purpose:** CRUD operations for employee/user records.

**Source:** `src/hooks/useUser.ts`

| Hook | Type | Description |
|---|---|---|
| `useUsers(trashed?)` | Query | Fetch all users; pass `true` for soft-deleted |
| `useUserByUuid(uuid)` | Query | Fetch a single user by UUID |
| `useGetManager()` | Query | Fetch manager-level users |
| `useGetProfile()` | Query | Fetch the currently authenticated user's profile |
| `useCreateUser()` | Mutation | Create a new user with optimistic update |
| `useUpdateUser()` | Mutation | Update an existing user with optimistic update |
| `useDeleteUser()` | Mutation | Soft-delete a user with optimistic update |
| `useRestoreUser()` | Mutation | Restore a soft-deleted user |
| `useForceDeleteUser()` | Mutation | Permanently delete a user |
| `useTerminateEmployment()` | Mutation | Terminate an employee (`resigned` / `terminated`) |
| `useChangeUserStatus()` | Mutation | Activate or deactivate a user account |
| `useUploadProfilePhoto()` | Mutation | Upload a profile photo |
| `useUpdatePassword()` | Mutation | Update the authenticated user's password |
| `useUpdateBiometricData()` | Mutation | Register/update face biometric data |

**Usage:**

```tsx
const { data: users, isLoading } = useUsers();
const createUser = useCreateUser();

createUser.mutate({ name: "Jane Doe", email: "jane@example.com", ... });
```

---

## `useAttendances` / `useSendBulkAttendance` / `useExportAttendance`

**Purpose:** Attendance data fetching and mutation.

**Source:** `src/hooks/useAttendance.ts`

| Hook | Type | Description |
|---|---|---|
| `useAttendances(params)` | Query | Fetch attendance records filtered by date range |
| `useDetailAttendance(id)` | Query | Fetch a single attendance record |
| `useAttendanceStatusToday()` | Query | Get today's clock-in/out status |
| `useSendBulkAttendance()` | Mutation | Submit multiple attendance entries |
| `useSendSingleAttendance()` | Mutation | Submit a single attendance entry |
| `useExportAttendance()` | Mutation | Export attendance data as `.xlsx` |

**Usage:**

```tsx
const { data } = useAttendances({ start_date: "2025-01-01", end_date: "2025-01-31" });

const exportAttendance = useExportAttendance();
exportAttendance.mutate({ start_date: "2025-01-01", end_date: "2025-01-31" });
```

---

## `useCrudModalForm`

**Purpose:** A generic hook that manages modal state, form state, and create/update submit logic for CRUD pages.

**Source:** `src/hooks/useCrudModalForm.ts`

**Parameters (config object):**

| Key | Type | Description |
|---|---|---|
| `label` | `string` | Human-readable resource label (used in toast messages) |
| `emptyForm` | `TForm` | Default empty form state |
| `mapToPayload` | `(form) => TPayload` | Maps form state to the API payload shape |
| `validate?` | `(form) => string \| null` | Optional validation before submit |
| `createFn?` | `(payload) => Promise` | API function for creating a resource |
| `updateFn?` | `(id, payload) => Promise` | API function for updating a resource |

**Returns:** `{ form, setForm, isOpen, isEdit, loading, openCreate, openEdit, close, submit }`

**Usage:**

```tsx
const crud = useCrudModalForm({
  label: "Division",
  emptyForm: { uuid: "", name: "" },
  mapToPayload: (form) => ({ name: form.name }),
  createFn: createDivision,
  updateFn: updateDivision,
});

// Open modal for new entry
crud.openCreate();

// Open modal pre-filled for editing
crud.openEdit(selectedRow);
```

---

## Other Notable Hooks

| Hook | Purpose |
|---|---|
| `useModal` | Simple boolean open/close modal state |
| `useShowModal` | Show modal tied to a specific data item |
| `useGoBack` | Navigate back in browser history |
| `useRoleName` | Resolve display name from a role ID |
| `useDashboard` | Fetch dashboard summary statistics |
| `useNotification` | Fetch and mark notifications as read |
| `usePayroll` | Fetch payroll records |
| `useLeave` | Leave CRUD and approval |
| `useOvertime` | Overtime CRUD and approval |
| `useEarlyLeave` | Early leave CRUD and approval |
| `useHoliday` | Holiday management |
| `useShiftTemplate` | Shift template CRUD |
| `useWorkSchedules` | Work schedule assignment |
| `useAllowance` | Allowance management |
| `useDivision` | Division CRUD |
| `usePosition` | Position CRUD |
| `useRole` | Role and permission management |
| `useSetting` | Application settings |
| `useTrashActions` | Generic restore/force-delete operations |
