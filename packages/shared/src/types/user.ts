export type UserRole = "model" | "designer";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ModelProfile {
  userId: string;
  gender?: "female" | "male" | "other";
  ageGroup?: string;
  preferredStyles: string[];
  hasTreatmentExperience: boolean;
  bio?: string;
}

export interface DesignerProfile {
  userId: string;
  salonName?: string;
  region: string;
  career: string;
  specialties: string[];
  allowContentUsage: boolean;
  allowFaceExposure: boolean;
  bio?: string;
}
