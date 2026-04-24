export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  publishedAt: string;
}

export interface CommentData {
  id: string; 
  author: string;
  text: string;
  likes: number;
  published_at: string;
}