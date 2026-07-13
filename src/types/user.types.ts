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

export interface SetRolePayload {
  role: "student" | "tutor";
}

export interface RefreshPayload {
  refresh_token: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}


export interface ApiError {
  detail:
    | string
    | {
        msg: string;
      }[];
}