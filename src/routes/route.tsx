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
  FileCheck2,
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
} from "lucide-react";
export type NavSubItem = {
  name: string;
  path: string;
  permission?: string;
  icon: React.ReactNode;
  pro?: boolean;
  new?: boolean;
};

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: NavSubItem[];
};

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
    
  },
  {
    name: "Attendances Report",
    icon: <ClipboardCheck size={20} />,
    path: "/attendances/report",
    permission: buildPermission(RESOURCES.ATTENDANCE, PERMISSIONS.BASE.INDEX),
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
    name: "Attendance Requests",
    path: "/attendance-requests",
    icon: <FileSpreadsheet size={20} />,
    permission: buildPermission(
      RESOURCES.ATTENDANCE_REQUEST,
      PERMISSIONS.BASE.INDEX,
    ),
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
    icon: <Settings size={20} />,
    name: "Settings",
    path: "/settings",
    permission: buildPermission(RESOURCES.SETTING, PERMISSIONS.BASE.INDEX),
  },
];
