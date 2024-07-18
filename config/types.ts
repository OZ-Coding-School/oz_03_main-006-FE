export interface NavToggleState {
  isOpen: boolean;
  toggleOpen: () => void;
}

export interface tag {
  tag_id: number;
  name: string;
}

export interface Post {
  post_id: number;
  user_id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  representative_image_id: string;
  travel_start_date: string;
  travel_end_date: string;
  tags?: tag[];
}
export interface User {
  user_id?: number;
  email: string;
  nickname?: string | null;
  username: string;
  profile_image?: string | null;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}
export interface SignUpUser {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface AlertState {
  showAlert: boolean;
  alertMessage: string;
  setAlert: (message: string) => void;
  clearAlert: () => void;
}
