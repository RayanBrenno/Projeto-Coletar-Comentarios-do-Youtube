import { type Comment, type CommentData } from "./comment";

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

export interface HistoryVideo {
  idVideo: string;
  codeURL: string;
  idUsuario: string;
  title: string;
  channel: string;
  publish_date: string;
  views: number;
  likes: number;
  comments: number;
  thumbnail_url?: string | null;
  last_updated_at?: string | null;
}

export interface ConsultResponse {
  video_id: string;
  video: {
    codeURL: string;
    title: string;
    channel: string;
    publish_date: string;
    views: number;
    likes: number;
    comments: number;
    thumbnail_url?: string | null;
    last_updated_at?: string | null;
  };
  total_comments: number;
  comments: CommentData[];
}

export interface UpdatedVideoState {
  before: HistoryVideo;
  after: ConsultResponse;
}