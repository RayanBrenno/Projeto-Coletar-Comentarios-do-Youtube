import {
  Eye,
  ThumbsUp,
  MessageSquare,
  Calendar,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

import { type VideoResultCardProps } from "../types/video";

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getDiff(current: number, previous?: number) {
  if (previous === undefined || previous === null) return null;
  return current - previous;
}

function formatDiff(value: number | null) {
  if (value === null) return null;

  if (value > 0) {
    return `+${formatNumber(value)}`;
  }

  return formatNumber(value);
}

function getYoutubeVideoUrl(video: VideoResultCardProps["video"]) {
  const rawValue =
    video.code_url || video.codeURL || video.url || video.video_url || "";

  if (!rawValue) return null;

  if (rawValue.startsWith("http")) {
    return rawValue;
  }

  return `https://www.youtube.com/watch?v=${rawValue}`;
}

export function VideoResultCard({
  video,
  totalComments,
  previousStats,
}: VideoResultCardProps) {
  const youtubeUrl = getYoutubeVideoUrl(video);

  const lastUpdatedAt = previousStats?.last_updated_at;

  const viewsDiff = getDiff(video.views, previousStats?.views);
  const likesDiff = getDiff(video.likes, previousStats?.likes);
  const commentsDiff = getDiff(video.comments, previousStats?.comments);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="w-full xl:w-[520px] 2xl:w-[580px] shrink-0">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full aspect-video rounded-xl border border-white/10 object-cover"
            />
          ) : (
            <div className="w-full aspect-video rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/30">
              Thumbnail indisponível
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-xl font-bold text-white leading-snug">
                {video.title}
              </h2>

              <p className="text-white/50 mt-2">{video.channel}</p>
            </div>

            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-fit inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200 transition-colors"
              >
                Abrir no YouTube
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  Publicado em
                </div>

                <p className="text-white font-semibold">
                  {formatDate(video.publish_date)}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
                  <Eye className="w-4 h-4" />
                  Views
                </div>

                <p className="text-white font-semibold">
                  {formatNumber(video.views)}
                </p>

                {viewsDiff !== null && (
                  <p className="text-xs text-red-300 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {formatDiff(viewsDiff)}
                  </p>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
                  <ThumbsUp className="w-4 h-4" />
                  Likes
                </div>

                <p className="text-white font-semibold">
                  {formatNumber(video.likes)}
                </p>

                {likesDiff !== null && (
                  <p className="text-xs text-red-300 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {formatDiff(likesDiff)}
                  </p>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Comentários
                </div>

                <p className="text-white font-semibold">
                  {formatNumber(video.comments)}
                </p>

                {commentsDiff !== null && (
                  <p className="text-xs text-red-300 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {formatDiff(commentsDiff)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {typeof totalComments === "number" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-200">
                  Comentários coletados:{" "}
                  <span className="font-semibold">
                    {formatNumber(totalComments)}
                  </span>
                </div>
              )}

              {lastUpdatedAt && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50">
                  Comparado com:{" "}
                  <span className="text-white/70">
                    {formatDate(lastUpdatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
