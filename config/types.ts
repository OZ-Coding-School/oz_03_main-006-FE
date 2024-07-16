export interface NavToggleState {
  isOpen: boolean;
  toggleOpen: () => void;
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
}

<<<<<<< HEAD
=======
export interface User {
  user_id: number;
  email: string;
  password: number;
  provider: string;
  social_id: number;
  nickname: string;
  location_id: string;
  created_at: string;
}
>>>>>>> dev
