export interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  source?: string;
}

export type AppView = 'signup' | 'hero' | 'admin';

export interface RegistrationResult {
  success: boolean;
  message?: string;
  user?: RegisteredUser;
}
