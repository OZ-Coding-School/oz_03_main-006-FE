export interface NavToggleState {
  isOpen: boolean;
  toggleOpen: () => void;
}

export interface Tag {
  tag_id: number;
  content: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
  content?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  travel_start_date: string;
  travel_end_date: string;
  tags?: Tag[];
  thumbnail: string | null;
}
export interface User {
  id: number;
  email?: string;
  nickname: string;
  profile_image: string | null;
  username?: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateProfileImage: (imageUrl: string) => void;
}
export interface SignUpUser {
  nickname: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginUser {
  nickname: string;
  password: string;
}

export interface AlertState {
  showAlert: boolean;
  alertMessage: string;
  setAlert: (message: string) => void;
  clearAlert: () => void;
}

export interface TagState {
  tags: Tag[];
  addTag: (content: string) => void;
  removeTag: (tag_id: number) => void;
  clearTags: () => void;
}

export interface DetailPostArticle {
  id: number;
  nickname: string;
  title: string;
  tag: string;
  region: number;
  body: string;
  created_at: string;
  view_count: number;
  travel_start_date: string | null;
  travel_end_date: string | null;
  user_id: number;
  likes_count: number;
}
