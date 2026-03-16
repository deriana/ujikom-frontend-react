import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { useGetEmployeeForInput } from "./useUser";

export function useEmployeeOptions(enabled?: boolean) {
  const { user } = useAuth();

  const { data: employees = [], isLoading } = useGetEmployeeForInput(enabled);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: any) => emp.nik !== user?.employee?.nik);
  }, [employees, user]);

  return {
    employees: filteredEmployees,
    isLoading,
  };
}