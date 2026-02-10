export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LEAVE: 'leave',
  OFF: 'off',
} as const;

export const ATTENDANCE_STATUS_LABEL: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  leave: 'Leave',
  off: 'Off Duty',
};

export const ATTENDANCE_STATUS_COLOR: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  present: 'success',
  absent: 'error',
  leave: 'warning',
  off: 'default',
};
