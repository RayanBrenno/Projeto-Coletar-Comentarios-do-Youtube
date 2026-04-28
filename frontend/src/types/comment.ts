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

export interface YoutubeCommentsListProps {
  title?: string;
  comments: YoutubeComment[];
  maxHeightClassName?: string;
}