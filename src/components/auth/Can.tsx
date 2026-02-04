import React, { ReactNode, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useCan } from "@/hooks/useCan";

interface CanProps {
  value: string;
  children: ReactNode;
  fallback?: ReactNode;
  disable?: boolean;
}

export const Can = ({ value, children, fallback = null, disable = false }: CanProps) => {
  const { loading } = useContext(AuthContext);
  const allowed = useCan(value);

  if (loading) return null;

  if (allowed) return <>{children}</>;

  if (disable && React.isValidElement(children)) {
    return React.cloneElement(children as any, { disabled: true });
  }

  return <>{fallback}</>;
};
