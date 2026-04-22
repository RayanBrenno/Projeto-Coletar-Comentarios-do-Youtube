import {
  Eye,
  ThumbsUp,
  MessageSquare,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { type VideoData } from "../types/video";

interface VideoCardProps {
  video: VideoData;
  onClick: (video: VideoData) => void;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <button
      onClick={() => onClick(video)}
      className="w-full text-left group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-red-200 transition-all duration-300"
    >
      <div className="relative overflow-hidden h-44">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {video.channel}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 font-semibold text-sm leading-snug line-clamp-2 mb-3 group-hover:text-red-700 transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(video.publishedAt)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <Eye size={12} className="text-red-400" />
            {formatNumber(video.views)}
          </span>
          <span className="flex items-center gap-1.5">
            <ThumbsUp size={12} className="text-red-400" />
            {formatNumber(video.likes)}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare size={12} className="text-red-400" />
            {formatNumber(video.commentCount)}
          </span>
          <span className="ml-auto flex items-center gap-1 text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Ver detalhes <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </button>
  );
}
