export interface VideoData {
  id: string;
  url: string;
  title: string;
  channel: string;
  publishedAt: string;
  views: number;
  likes: number;
  commentCount: number;
  thumbnail: string;
  comments: Comment[];
  consultedAt: string;
}
