import { type YoutubeComment } from "./comment";

export interface YoutubeVideo {
  id?: string;
  code_url?: string;
  codeURL?: string;
  url?: string;
  video_url?: string;
  title: string;
  channel: string;
  publish_date?: string | null;
  views: number;
  likes: number;
  comments: number;
  thumbnail_url?: string | null;
  last_updated_at?: string | null;
  consulted_at?: string | null;
}

export interface ExistingVideo {
  id: string;
  code_url: string;
  title: string;
  channel: string;
  thumbnail_url?: string | null;
  last_updated_at?: string | null;
  consulted_at?: string | null;
}

export interface HistoryVideo {
  idVideo: string;
  code_url?: string;
  title: string;
  channel: string;
  publish_date?: string | null;
  views: number;
  likes: number;
  comments: number;
  thumbnail_url?: string | null;
  last_updated_at?: string | null;
  consulted_at?: string | null;
}

export interface PreviousVideoStats {
  views: number;
  likes: number;
  comments: number;
  last_updated_at?: string | null;
}

export interface VideoStatsDiff {
  views: number;
  likes: number;
  comments: number;
}

export interface CheckVideoResponse {
  exists: boolean;
  video: ExistingVideo | null;
}

export interface ConsultResponse {
  video: YoutubeVideo;
  comments: YoutubeComment[];
  total_comments: number;
}

export interface UpdateVideoResponse extends ConsultResponse {
  previous?: PreviousVideoStats;
  diff?: VideoStatsDiff;
}

export interface UpdatedVideoViewState {
  before: PreviousVideoStats;
  after: UpdateVideoResponse;
}

export interface VideoResultCardProps {
  video: YoutubeVideo;
  totalComments?: number;
  previousStats?: PreviousVideoStats;
}