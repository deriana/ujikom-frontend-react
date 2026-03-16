import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import { RESOURCES } from "@/constants/Resource";
import {
  LayoutGrid,
  ClipboardCheck,
  CalendarClock,
  CalendarDays,
  FileText,
  FileSpreadsheet,
  FileClock,
  Clock,
  DollarSign,
  Database,
  ShieldCheck,
  Users,
  Network,
  Wallet,
  Briefcase,
  Palmtree,
  Settings,
  Calendar,
  UserCircle,
  Trash2,
  LayoutDashboard,
  FileCheck2,
  ClipboardList,
  ChartBar,
  Activity,
} from "lucide-react";

export type NavSubItem = {
  name: string;
  path: string;
  permission?: string;
  icon: React.ReactNode;
  pro?: boolean;
  new?: boolean;
  hideForAdmin?: boolean;
};

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: NavSubItem[];
  hideForAdmin?: boolean;
};

export type NavMobileItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  permission?: string;
  primary?: boolean;
}

export const navItems: NavItem[] = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Admin Dashboard",
    path: "/dashboard/admin",
    permission: buildPermission(RESOURCES.DASHBOARD, PERMISSIONS.DASHBOARD.admin),
  },
  {
    icon: <LayoutDashboard size={20} />,
    name: "Employee Dashboard",
    path: "/dashboard/employee",
    permission: buildPermission(RESOURCES.DASHBOARD, PERMISSIONS.DASHBOARD.employee),
    hideForAdmin: true,
  },
  {
    name: "Attendances",
    icon: <ClipboardCheck size={20} />,
    subItems: [
      {
        name: "Attendance Report",
        path: "/attendances/report",
        icon: <FileSpreadsheet size={18} />,
        permission: buildPermission(RESOURCES.ATTENDANCE, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Attendance Requests",
        path: "/attendance-requests",
        icon: <FileText size={18} />,
        permission: buildPermission(
          RESOURCES.ATTENDANCE_REQUEST,
          PERMISSIONS.BASE.INDEX,
        ),
      },
      {
        name: "Attendance Adjustments",
        path: "/attendances/correction",
        icon: <FileCheck2 size={18} />,
        permission: buildPermission(
          RESOURCES.ATTENDANCE_REQUEST,
          PERMISSIONS.BASE.INDEX,
        ),
      },
    ],
  },
  {
    name: "Employee Shifts",
    path: "/employee-shifts",
    icon: <CalendarClock size={20} />,
    permission: buildPermission(
      RESOURCES.EMPLOYEE_SHIFT,
      PERMISSIONS.BASE.INDEX,
    ),
  },
  {
    name: "Employee Work Schedules",
    path: "/employee-work-schedules",
    icon: <CalendarDays size={20} />,
    permission: buildPermission(
      RESOURCES.WORK_SCHEDULE,
      PERMISSIONS.BASE.INDEX,
    ),
  },
  {
    name: "Division Employees",
    path: "/divisions/all",
    icon: <Network size={20} />,
  },
  {
    name: "Leave Balances",
    path: "/employee-leave-balances",
    icon: <Wallet size={20} />,
    permission: buildPermission(
      RESOURCES.LEAVE_TYPES,
      PERMISSIONS.BASE.INDEX,
    ),
  },
  {
    name: "Leaves",
    path: "/leaves",
    icon: <Palmtree size={20} />,
    permission: buildPermission(RESOURCES.LEAVE, PERMISSIONS.BASE.INDEX),
  },
  {
    name: "Early Leaves",
    path: "/early-leaves",
    icon: <FileClock size={20} />,
    permission: buildPermission(RESOURCES.EARLY_LEAVE, PERMISSIONS.BASE.INDEX),
  },
  {
    name: "Overtimes",
    path: "/overtimes",
    icon: <Clock size={20} />,
    permission: buildPermission(RESOURCES.OVERTIME, PERMISSIONS.BASE.INDEX),
  },
  {
    name: "Payroll",
    path: "/payroll",
    icon: <DollarSign size={20} />,
    permission: buildPermission(RESOURCES.PAYROLL, PERMISSIONS.BASE.INDEX),
  },
  {
    name: "Assessments",
    path: "/assessments",
    icon: <ClipboardList size={20} />,
    permission: buildPermission(RESOURCES.ASSESSMENT, PERMISSIONS.BASE.INDEX),
  },
  {
    name: "Approval",
    icon: <FileCheck2 size={20} />,
    subItems: [
      {
        name: "Leave Approval",
        path: "/approval/leave",
        icon: <Palmtree size={18} />,
        permission: buildPermission(RESOURCES.LEAVE, PERMISSIONS.BASE.APPROVE),
      },
      {
        name: "Early Leave Approval",
        path: "/approval/early-leave",
        icon: <FileClock size={18} />,
        permission: buildPermission(
          RESOURCES.EARLY_LEAVE,
          PERMISSIONS.BASE.APPROVE,
        ),
      },
      {
        name: "Attendance Request Approval",
        path: "/approval/attendance-request",
        icon: <FileSpreadsheet size={18} />,
        permission: buildPermission(
          RESOURCES.ATTENDANCE_REQUEST,
          PERMISSIONS.BASE.APPROVE,
        ),
      },
      {
        name: "Overtime Approval",
        path: "/approval/overtime",
        icon: <Clock size={18} />,
        permission: buildPermission(
          RESOURCES.OVERTIME,
          PERMISSIONS.BASE.APPROVE,
        ),
      },
      {
        name: "Attendance Adjustments Approval",
        path: "/approval/attendance-correction",
        icon: <FileCheck2 size={18} />,
        permission: buildPermission(
          RESOURCES.ATTENDANCE_CORRECTION,
          PERMISSIONS.BASE.APPROVE,
        ),
      }
    ],
  },
  {
    name: "Master Data",
    icon: <Database size={20} />,
    subItems: [
      {
        name: "Roles",
        path: "/roles",
        icon: <ShieldCheck size={18} />,
        permission: buildPermission(RESOURCES.ROLE, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Users",
        path: "/users",
        icon: <Users size={18} />,
        permission: buildPermission(RESOURCES.USER, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Divisions",
        path: "/divisions",
        icon: <Network size={18} />,
        permission: buildPermission(RESOURCES.DIVISION, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Allowances",
        path: "/allowances",
        icon: <Wallet size={18} />,
        permission: buildPermission(
          RESOURCES.ALLOWANCE,
          PERMISSIONS.BASE.INDEX,
        ),
      },
      {
        name: "Positions",
        path: "/Positions",
        icon: <Briefcase size={18} />,
        permission: buildPermission(RESOURCES.POSITION, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Holidays",
        path: "/holidays",
        icon: <Calendar size={18} />,
        permission: buildPermission(RESOURCES.HOLIDAY, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Work Schedules",
        path: "/work-schedules",
        icon: <CalendarDays size={18} />,
        permission: buildPermission(
          RESOURCES.WORK_SCHEDULE,
          PERMISSIONS.BASE.INDEX,
        ),
      },
      {
        name: "Shift Templates",
        path: "/shift-templates",
        icon: <CalendarClock size={18} />,
        permission: buildPermission(
          RESOURCES.SHIFT_TEMPLATE,
          PERMISSIONS.BASE.INDEX,
        ),
      },
      {
        name: "Leave Types",
        path: "/leave-types",
        icon: <FileText size={18} />,
        permission: buildPermission(
          RESOURCES.LEAVE_TYPES,
          PERMISSIONS.BASE.INDEX,
        ),
      },
      {
        name: "Assessment Category",
        path: "/assessment_category",
        icon: <ClipboardList size={18} />,
        permission: buildPermission(
          RESOURCES.ASSESSMENT_CATEGORY,
          PERMISSIONS.BASE.INDEX,
        ),
      },
    ],
  },
  {
    icon: <Calendar size={20} />,
    name: "Calendar",
    path: "/calendar",
  },
];

export const othersItems: NavItem[] = [
  {
    icon: <Trash2 size={20} />,
    name: "Trash",
    subItems: [
      {
        name: "Divisions",
        path: "/trash/divisions",
        icon: <Network size={18} />,
        permission: buildPermission(
          RESOURCES.DIVISION,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
      {
        name: "Allowances",
        path: "/trash/allowances",
        icon: <Wallet size={18} />,
        permission: buildPermission(
          RESOURCES.ALLOWANCE,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
      {
        name: "Positions",
        path: "/trash/positions",
        icon: <Briefcase size={18} />,
        permission: buildPermission(
          RESOURCES.POSITION,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
      {
        name: "Users",
        path: "/trash/users",
        icon: <Users size={18} />,
        permission: buildPermission(RESOURCES.USER, PERMISSIONS.BASE.RESTORE),
      },
      {
        name: "Work Schedules",
        path: "/trash/work-schedules",
        icon: <CalendarDays size={18} />,
        permission: buildPermission(
          RESOURCES.WORK_SCHEDULE,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
      {
        name: "Shift Templates",
        path: "/trash/shift-templates",
        icon: <CalendarClock size={18} />,
        permission: buildPermission(
          RESOURCES.SHIFT_TEMPLATE,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
    ],
  },
  {
    icon: <UserCircle size={20} />,
    name: "Profile",
    path: "/profile",
  },
  {
    icon: <Clock size={20} />,
    name: "Single Attendance",
    path: "/attendance/menu",
    hideForAdmin: true,
  },
  {
    icon: <Settings size={20} />,
    name: "Settings",
    path: "/settings",
    permission: buildPermission(RESOURCES.SETTING, PERMISSIONS.BASE.INDEX),
  },
];

export const mobileItems: NavMobileItem[] = [
  {
    name: "Home",
    path: "/home",
    icon: <LayoutDashboard size={22} />,
  },
  {
    name: "Stats",
    icon: <ChartBar size={22} />,
    path: "/stats",
  },
  {
    name: "Approval",
    icon: <FileCheck2 size={22} />,
    path: "/approval",
    permission: "has-any-approval",
  },
  // {
  //   name: "Payroll",
  //   icon: <Wallet size={22} />,
  //   path: "/payroll",
  // },
  {
    name: "Activity",
    icon: <Activity size={22} />,
    path: "/activity",
  },
  {
    name: "Profile",
    icon: <UserCircle size={22} />,
    path: "/profile",
  },
];