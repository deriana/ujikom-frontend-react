export const GENDER = {
  MALE: "male",
  FEMALE: "female",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const GENDER_OPTIONS = [
  { value: GENDER.MALE, label: "Male" },
  { value: GENDER.FEMALE, label: "Female" },
];