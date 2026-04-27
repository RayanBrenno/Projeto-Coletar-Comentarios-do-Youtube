export interface YoutubeComment {
  id?: string | null;
  author: string;
  text: string;
  likes: number;
  published_at?: string | null;
  avatar?: string | null;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  publishedAt: string;
}