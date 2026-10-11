export type UserRole = 'customer' | 'worker' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  joinedDate: string;
  workerProfileId?: string; // Links to professional profile if worker
}
