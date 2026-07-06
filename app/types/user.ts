export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  profilePhoto?: string;
}

export interface UserProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  role: string;
  createdAt: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    latitude: number;
    longitude: number;
    createdAt: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      avatar: string;
    };
    token: string;
  };
}

// // Auth Types
// export interface User {
//   id: number
//   name: string
//   email: string
//   phone?: string
//   avatar?: string
//   //   location?: string;
// }

export interface LoginPayload {
  email: string;
  password: string;
}
