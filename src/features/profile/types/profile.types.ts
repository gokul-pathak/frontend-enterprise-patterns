export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  department: string;
  jobTitle: string;
  avatarUrl: string | null;
  address: Address;
  linkedIn: string;
  github: string;
}

export type UpdateProfilePayload = Omit<UserProfile, 'id' | 'email' | 'avatarUrl'>;
