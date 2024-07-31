export interface NavToggleState {
  isOpen: boolean;
  toggleOpen: () => void;
}

export interface Tag {
  tag_id: number;
  content: string;
}

export interface Image {
  image_url: string;
}

export interface Locations {
  location_id: number;
  city: string;
  description: string;
  images: Image[];
  popular_cities: string;
  district: string;
  highlights?: string;
  l_category: string;
  top_posts?: Post[];
}

export interface Post {
  body: string;
  content?: string;
  created_at: string;
  id: number;
  location: number;
  tag: string;
  thumbnail: string;
  title: string;
  travel_end_date: string;
  travel_start_date: string;
  updated_at: string;
  user_id: number;
  view_count: number;
  likes_count: number;
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
  confirmResult: ((result: boolean) => void) | null;
  setAlert: (message: string) => void;
  clearAlert: () => void;
  showConfirmAlert: (message: string) => Promise<boolean>;
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
  location: string;
}

export interface PostingFormData {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  content: string;
  tagValue: string;
  thumbnail?: FileList;
  [key: string]: string | FileList | undefined;
}

export interface PostResponse {
  id: number;
  images: string[] | null;
  title: string;
  tag: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  travel_start_date: string;
  travel_end_date: string;
  thumbnail: string | null;
  user_id: number;
  location: number;
}
