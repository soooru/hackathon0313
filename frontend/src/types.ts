export interface User {
  id: number;
  email: string;
  nickname: string;
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  tag: '팝니다' | '삽니다' | '나눕니다' | '같이삽시다';
  status: '가능' | '완료';
  price: number | null;
  is_negotiable: number;
  max_participants: number | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  nickname: string;
  comment_count?: number;
  latest_comment_content?: string | null;
  latest_comment_nickname?: string | null;
  participant_count?: number;
}

export interface GroupBuyParticipant {
  email: string;
  nickname: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  nickname: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
