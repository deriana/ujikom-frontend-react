export interface Column<T> {
  header: string;
  accessor?: keyof T;        
  render?: (row: T) => React.ReactNode; 
  className?: string;          
}


export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  image: string;
  role: string; // tambahkan ini kalau dipakai di kolom render
  projectName: string;
  budget: string;
  status: "Active" | "Pending" | "Cancel";
}
