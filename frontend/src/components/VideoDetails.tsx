import {
  Eye,
  ThumbsUp,
  MessageSquare,
  Calendar,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { type VideoData } from "../types/video";
import { CommentList } from "./CommentList";

interface VideoDetailsProps {
  video: VideoData;
  onBack?: () => void;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-base font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export function VideoDetails({ video, onBack }: VideoDetailsProps) {
  return (
    <div className="space-y-5">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Voltar para a lista
        </button>
      )}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {video.channel}
              </span>
            </div>
            <h1 className="text-white font-bold text-lg md:text-xl leading-snug line-clamp-2">
              {video.title}
            </h1>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Calendar size={14} className="text-red-400" />
            <span>Publicado em {formatDate(video.publishedAt)}</span>
          </div>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <ExternalLink size={13} />
            Abrir vídeo
          </a>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Eye size={18} />}
          label="Visualizações"
          value={formatNumber(video.views)}
        />
        <StatCard
          icon={<ThumbsUp size={18} />}
          label="Curtidas"
          value={formatNumber(video.likes)}
        />
        <StatCard
          icon={<MessageSquare size={18} />}
          label="Comentários"
          value={formatNumber(video.commentCount)}
        />
      </div>
      <CommentList comments={[]} total={video.commentCount} />{" "}
    </div>
  );
}
