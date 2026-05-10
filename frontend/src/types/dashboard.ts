export interface DashboardSentiment {
  positivo: number;
  neutro: number;
  negativo: number;
  total: number;
}

export interface DashboardLatestVideo {
  id: string;
  code_url?: string | null;
  title: string;
  channel: string;
  thumbnail_url?: string | null;
  views: number;
  likes: number;
  comments: number;
  last_updated_at?: string | null;
}

export interface DashboardTopVideo {
  id: string;
  code_url?: string | null;
  title: string;
  channel: string;
  thumbnail_url?: string | null;
  views: number;
  likes: number;
  comments: number;
}

export interface DashboardSummary {
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_video_comments: number;
  total_collected_comments: number;
  sentiment: DashboardSentiment;
  latest_video: DashboardLatestVideo | null;
  top_videos: DashboardTopVideo[];
}
