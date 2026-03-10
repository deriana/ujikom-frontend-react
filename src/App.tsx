import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/Error/NotFound";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useState, useEffect } from "react";
import Spinner from "./components/ui/loading/Spinner";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import Roles from "./pages/Roles/Index";
import RolesCreate from "./pages/Roles/Create";
import RolesUpdate from "./pages/Roles/Update";
// import Trash from "./pages/Trash/Index";
import Divisions from "./pages/Division/Index";
import DivisionsTrash from "./pages/Trash/Pages/DivisionTrash";
import Maintenance from "./pages/Error/Maintenance";
import ServerError from "./pages/Error/ServerError";
import Forbidden from "./pages/Error/Forbidden";
import PermissionRoute from "./routes/PermissionRoute";
import { buildPermission, PERMISSIONS } from "./constants/Permissions";
import { RESOURCES } from "./constants/Resource";
import Allowances from "./pages/Allowances/Index";
import AllowancesTrash from "./pages/Trash/Pages/AllowanceTrash";
import Positions from "./pages/Positions/Index";
import PositionsTrash from "./pages/Trash/Pages/PositionTrash";
import Setting from "./pages/Settings/Setting";
import Users from "./pages/User/Index";
import UsersCreate from "./pages/User/Create";
import UsersUpdate from "./pages/User/Update";
import UsersShow from "./pages/User/Show";
import UsersTrash from "./pages/Trash/Pages/UsersTrash";
import FaceScanner from "./pages/Attendance/BulkFaceRecognition";
import AttendancesReport from "./pages/AttendanceReport/Index";
import Holidays from "./pages/Holidays/Index";
import WorkSchedules from "./pages/WorkSchedules/Index";
import WorkScheduleTrash from "./pages/Trash/Pages/WorkScheduleTrash";
import EmployeeWorkSchedule from "./pages/EmployeeWorkSchedule/Index";
import ShiftTemplate from "./pages/ShiftTemplate/Index";
import ShiftTemplateTrash from "./pages/Trash/Pages/ShiftTemplateTrash";
import EmployeeShifts from "./pages/EmployeeShift/Index";
import LeaveTypes from "./pages/LeaveType/Index";
import Leave from "./pages/Leave/Index";
import EarlyLeaves from "./pages/EarlyLeaves/Index";
import AttendancRequests from "./pages/AttendanceRequest/Index";
import LeaveApproval from "./pages/Approval/LeaveApproval";
import EarlyLeaveApproval from "./pages/Approval/EarlyLeaveApproval";
import AttendanceRequestApproval from "./pages/Approval/AttendanceRequestApproval";
import Overtime from "./pages/Overtime/Index";
import OvertimeApproval from "./pages/Approval/OvertimeApproval";
import Payroll from "./pages/Payroll/Index";
import Notification from "./pages/Notification/Notification";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import EmployeeDashboard from "./pages/Dashboard/EmployeeDashboard";
import Profile from "./pages/Employee/Profile";
import SingleAttendance from "./pages/Attendance/SingleFaceRecognition";
import FinalizeActivationPage from "./pages/AuthPages/FinalizeActivation";
import { LandingPageWrapper } from "./pages/Landing/Index";
import CareerPage from "./pages/Careers/CareerPage";
// import JobListPage from "./components/landing/JobListPage";
import ResetPasswordPage from "./pages/AuthPages/ResetPassword";
import ForgotPasswordPage from "./pages/AuthPages/ForgotPassword";
import EmployeeLeaveBalances from "./pages/LeaveType/EmployeeLeaveBalance";
import MobileLayout from "./layout/MobileLayout";
import MobileHome from "./pages/Mobile/Home";
import { useRoleName } from "./hooks/useRoleName";
import { ROLES } from "./constants/Roles";
import MobileStats from "./pages/Mobile/Stats";
import PayrollDetailMobile from "./pages/Mobile/PayrollDetail";
import Activity from "./pages/Mobile/Activity";
import ApprovalMenu from "./pages/Mobile/ApprovalMenu";
import MobileGuard from "./routes/MobileGuard";
import LeaveBalances from "./pages/Mobile/LeaveBalance";
import RouteServiceProvider from "./providers/RouteServiceProvider";
import { useIsMobile } from "./hooks/useIsMobile";

export default function App() {
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const { isRole } = useRoleName();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const publicRoutes = [
    { path: "/calendar", element: <Calendar /> },
    { path: "/blank", element: <Blank /> },
    { path: "/profile", element: <Profile /> },
  ];

  const protectedRoutes = [
    {
      path: "/dashboard/admin",
      element: <AdminDashboard />,
      resource: RESOURCES.DASHBOARD,
      permission: PERMISSIONS.DASHBOARD.admin,
    },
    {
      path: "/dashboard/employee",
      element: <EmployeeDashboard />,
      resource: RESOURCES.DASHBOARD,
      permission: PERMISSIONS.DASHBOARD.employee,
    },
    {
      path: "/attendances/report",
      element: <AttendancesReport />,
      resource: RESOURCES.ATTENDANCE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/roles",
      element: <Roles />,
      resource: RESOURCES.ROLE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/roles/create",
      element: <RolesCreate />,
      resource: RESOURCES.ROLE,
      permission: PERMISSIONS.BASE.CREATE,
    },
    {
      path: "/roles/:id/edit",
      element: <RolesUpdate />,
      resource: RESOURCES.ROLE,
      permission: PERMISSIONS.BASE.EDIT,
    },
    {
      path: "/users",
      element: <Users />,
      resource: RESOURCES.USER,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/users/create",
      element: <UsersCreate />,
      resource: RESOURCES.USER,
      permission: PERMISSIONS.BASE.CREATE,
    },
    {
      path: "/users/:uuid/show",
      element: <UsersShow />,
      resource: RESOURCES.USER,
      permission: PERMISSIONS.BASE.SHOW,
    },
    {
      path: "/users/:uuid/edit",
      element: <UsersUpdate />,
      resource: RESOURCES.USER,
      permission: PERMISSIONS.BASE.EDIT,
    },
    {
      path: "/divisions",
      element: <Divisions />,
      resource: RESOURCES.DIVISION,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/allowances",
      element: <Allowances />,
      resource: RESOURCES.ALLOWANCE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/positions",
      element: <Positions />,
      resource: RESOURCES.POSITION,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/holidays",
      element: <Holidays />,
      resource: RESOURCES.HOLIDAY,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/work-schedules",
      element: <WorkSchedules />,
      resource: RESOURCES.WORK_SCHEDULE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/employee-work-schedules",
      element: <EmployeeWorkSchedule />,
      resource: RESOURCES.EMPLOYEE_WORK_SCHEDULE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/shift-templates",
      element: <ShiftTemplate />,
      resource: RESOURCES.SHIFT_TEMPLATE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/employee-shifts",
      element: <EmployeeShifts />,
      resource: RESOURCES.SHIFT_TEMPLATE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/leave-types",
      element: <LeaveTypes />,
      resource: RESOURCES.SHIFT_TEMPLATE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/leaves",
      element: <Leave />,
      resource: RESOURCES.LEAVE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/early-leaves",
      element: <EarlyLeaves />,
      resource: RESOURCES.EARLY_LEAVE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/attendance-requests",
      element: <AttendancRequests />,
      resource: RESOURCES.EARLY_LEAVE,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/overtimes",
      element: <Overtime />,
      resource: RESOURCES.OVERTIME,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/payroll",
      element: <Payroll />,
      resource: RESOURCES.PAYROLL,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/settings",
      element: <Setting />,
      resource: RESOURCES.SETTING,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "employee-leave-balances",
      element: <EmployeeLeaveBalances />,
      resource: RESOURCES.LEAVE_TYPES,
      permission: PERMISSIONS.BASE.INDEX,
    },
    {
      path: "/notifications",
      element: <Notification />,
    },

    /** Approval Route */
    {
      path: "/approval/leave",
      element: <LeaveApproval />,
      resource: RESOURCES.LEAVE,
      permission: PERMISSIONS.BASE.APPROVE,
    },
    {
      path: "/approval/early-leave",
      element: <EarlyLeaveApproval />,
      resource: RESOURCES.EARLY_LEAVE,
      permission: PERMISSIONS.BASE.APPROVE,
    },
    {
      path: "/approval/attendance-request",
      element: <AttendanceRequestApproval />,
      resource: RESOURCES.ATTENDANCE_REQUEST,
      permission: PERMISSIONS.BASE.APPROVE,
    },
    {
      path: "/approval/overtime",
      element: <OvertimeApproval />,
      resource: RESOURCES.OVERTIME,
      permission: PERMISSIONS.BASE.APPROVE,
    },

    /** Trash Route */
    {
      path: "/trash/divisions",
      element: <DivisionsTrash />,
      resource: RESOURCES.DIVISION,
      permission: PERMISSIONS.BASE.RESTORE,
    },
    {
      path: "/trash/allowances",
      element: <AllowancesTrash />,
      resource: RESOURCES.ALLOWANCE,
      permission: PERMISSIONS.BASE.RESTORE,
    },
    {
      path: "/trash/positions",
      element: <PositionsTrash />,
      resource: RESOURCES.POSITION,
      permission: PERMISSIONS.BASE.RESTORE,
    },
    {
      path: "/trash/users",
      element: <UsersTrash />,
      resource: RESOURCES.USER,
      permission: PERMISSIONS.BASE.RESTORE,
    },
    {
      path: "/trash/work-schedules",
      element: <WorkScheduleTrash />,
      resource: RESOURCES.WORK_SCHEDULE,
      permission: PERMISSIONS.BASE.RESTORE,
    },
    {
      path: "/trash/shift-templates",
      element: <ShiftTemplateTrash />,
      resource: RESOURCES.WORK_SCHEDULE,
      permission: PERMISSIONS.BASE.RESTORE,
    },
    // Mobile View
    {
      path: "/home",
      element: <MobileHome />,
      isMobileOnly: true,
    },
    {
      path: "/stats",
      element: <MobileStats />,
      isMobileOnly: true,
    },
    {
      path: "/payroll/:uuid",
      element: <PayrollDetailMobile />,
      isMobileOnly: true,
    },
    {
      path: "/activity",
      element: <Activity />,
      isMobileOnly: true,
    },
    {
      path: "/approval",
      element: <ApprovalMenu />,
      permission: "has-any-approval",
      isMobileOnly: true,
    },
    {
      path: "/leave-balances",
      element: <LeaveBalances />,
      isMobileOnly: true,
    },
  ];

  const renderRoutes = (
    <>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {protectedRoutes.map(
        ({ path, element, resource, permission, isMobileOnly }) => {
          const isAdminRole = isRole(ROLES.ADMIN) || isRole(ROLES.OWNER);
          const isMobilePath = path === "/home";
          const isAdminPath = path === "/dashboard/admin";

          let finalElement = element;

          // Logika redirect yang sudah ada
          if (isMobilePath && isAdminRole) {
            finalElement = <Navigate to="/dashboard/admin" replace />;
          } else if (isAdminPath && !isAdminRole) {
            finalElement = isMobile ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/dashboard/employee" replace />
            );
          }

          // --- LOGIKA BARU: Guard untuk isMobileOnly ---
          const routeContent = (
            <Route
              key={path}
              path={path}
              element={isMobileOnly ? <MobileGuard /> : finalElement}
            >
              {isMobileOnly && <Route index element={finalElement} />}
            </Route>
          );

          // Gabungkan dengan PermissionRoute jika ada
          return resource && permission ? (
            <Route
              key={`perm-${path}`}
              element={
                <PermissionRoute
                  permission={buildPermission(resource, permission)}
                />
              }
            >
              {routeContent}
            </Route>
          ) : (
            routeContent
          );
        },
      )}
    </>
  );

  return (
    <>
      {loading && <Spinner />}

      <Router>
        <ScrollToTop />
        <Toaster position="top-right" containerStyle={{ zIndex: 999999 }} />

        <Routes>
          <Route
            path="/"
            element={
              <RouteServiceProvider>
                <LandingPageWrapper />
              </RouteServiceProvider>
            }
          />
          {/* 🔓 1. Public Routes (Taruh di paling atas) */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/set-password" element={<FinalizeActivationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/careers/:jobId" element={<CareerPage />} />
          <Route path="/attendance" element={<FaceScanner />} />

          {/* 🔒 2. Protected Area */}
          <Route element={<ProtectedRoute />}>
            <Route path="/attendance/single" element={<SingleAttendance />} />
            <Route
              element={
                isRole(ROLES.ADMIN) || isRole(ROLES.OWNER) ? (
                  <AppLayout />
                ) : isMobile ? (
                  <MobileLayout />
                ) : (
                  <AppLayout />
                )
              }
            >
              {isMobile && !isRole(ROLES.ADMIN) && !isRole(ROLES.OWNER) && (
                <>
                  <Route path="/home" element={<MobileHome />} />

                  <Route
                    path="/dashboard/employee"
                    element={<Navigate to="/home" replace />}
                  />
                </>
              )}

              {renderRoutes}
            </Route>
          </Route>

          {/* 🚫 3. Error Pages & Fallback */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/503" element={<Maintenance />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </>
  );
}
