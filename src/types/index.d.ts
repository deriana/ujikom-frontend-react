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
