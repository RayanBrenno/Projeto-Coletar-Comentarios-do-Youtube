export interface YoutubeComment {
  id?: string;
  author: string;
  text: string;
  likes: number;
  published_at?: string | null;
  publishedAt?: string | null;
  intencao?: string | null;
  score?: number | null;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  publishedAt: string;
  intencao?: string;
  score?: number;
}