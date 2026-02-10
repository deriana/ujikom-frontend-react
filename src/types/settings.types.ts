export interface AttendanceValues {
  work_end_time: string;
  work_start_time: string;
  late_tolerance_minutes: number;
}

export interface GeneralValues {
  logo: string;
  footer: string;
  favicon: string;
  site_name: string;
}
  
export interface GeoFencingValues {
  radius_meters: number;
  office_latitude: number;
  office_longitude: number;
}

export interface SettingCategory<T> {
  key: string;
  values: T;
}

export interface SettingsData {
  attendance: SettingCategory<AttendanceValues>;
  general: SettingCategory<GeneralValues>;
  geo_fencing: SettingCategory<GeoFencingValues>;
}

export interface SettingsInput {
  type: string;
}
