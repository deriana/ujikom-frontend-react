export type UUID = string;

export interface Column<T> {
  header: string;
  accessor?: keyof T;        
  render?: (row: T) => React.ReactNode; 
  className?: string;          
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface Timestamps {
  created_at: Date;
  updated_at: Date;
}

export interface Creator {
  created_by_id: string;
  updated_by_id: string;
  deleted_by_id: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  image: string;
  role: string; 
  projectName: string;
  budget: string;
  status: "Active" | "Pending" | "Cancel";
}

export interface UserLite {
  uuid: UUID;
  name: string;
  email: string;
}

export interface AllowancePositionPivot {
  uuid: UUID;
  name: string;
  amount?: number;
}