import { useMemo } from "react";
import { checkPasswordStrength, getStrengthPercentage } from "@/utils/password-validator";

export const usePasswordValidation = (password?: string) => {
  const safePassword = password ?? "";

  const validation = useMemo(() => checkPasswordStrength(safePassword), [safePassword]);
  const strength = useMemo(() => getStrengthPercentage(safePassword), [safePassword]);

  const isValid = validation ? (validation.hasMinLength && validation.hasUppercase && validation.hasNumber) : false;

  return {
    ...(validation || {}),
    strength: strength || 0,
    isValid,
  };
};