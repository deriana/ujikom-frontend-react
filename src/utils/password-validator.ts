export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
};

export const checkPasswordStrength = (password: string | null | undefined) => {
  const pwd = password ?? ""; 
  
  return {
    hasMinLength: pwd.length >= (PASSWORD_RULES.MIN_LENGTH || 8),
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  };
};

export const getStrengthPercentage = (password: string | null | undefined) => {
  const pwd = password ?? "";
  const checks = checkPasswordStrength(pwd);
  
  const values = Object.values(checks);
  const totalSteps = values.length;
  const passedSteps = values.filter(Boolean).length;
  
  return totalSteps === 0 ? 0 : (passedSteps / totalSteps) * 100;
};