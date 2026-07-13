export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  streakDays: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}