import { useEffect, useState } from "react";
import {
  Film,
  Eye,
  ThumbsUp,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Clock,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import {
  getApiErrorMessage,
  getDashboardSummary,
} from "../services/youtubeService";
import { type DashboardSummary } from "../types/dashboard";

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

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

export function HomePage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    async function loadSummary(userId: string) {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardSummary(userId);

        if (!cancelled) {
          setSummary(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(err) ||
              "Não foi possível carregar o resumo.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary(user.id);

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white/60">
          Carregando resumo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full">
        <div className="bg-white/5 border border-red-500/30 rounded-2xl p-8 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="w-full h-full">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white/60">
          Nenhum dado disponível.
        </div>
      </div>
    );
  }

  const sentimentTotal = summary.sentiment.total;
  const positivoPct = percent(summary.sentiment.positivo, sentimentTotal);
  const neutroPct = percent(summary.sentiment.neutro, sentimentTotal);
  const negativoPct = percent(summary.sentiment.negativo, sentimentTotal);

  const isEmpty = summary.total_videos === 0;

  return (
    <div className="w-full space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-1">Início</h1>
        <p className="text-white/50">
          Resumo geral das suas consultas e análises.
        </p>
      </div>

      {isEmpty ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white/60">
          Você ainda não consultou nenhum vídeo. Use a aba{" "}
          <span className="text-red-300">Consultar</span> para começar.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={<Film className="w-4 h-4" />}
              label="Vídeos consultados"
              value={formatNumber(summary.total_videos)}
            />
            <StatCard
              icon={<MessageSquare className="w-4 h-4" />}
              label="Comentários coletados"
              value={formatNumber(summary.total_collected_comments)}
            />
            <StatCard
              icon={<Eye className="w-4 h-4" />}
              label="Views acumuladas"
              value={formatNumber(summary.total_views)}
            />
            <StatCard
              icon={<ThumbsUp className="w-4 h-4" />}
              label="Likes acumulados"
              value={formatNumber(summary.total_likes)}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-300" />
                <h2 className="text-lg font-semibold text-white">
                  Distribuição de sentimentos
                </h2>
              </div>

              {sentimentTotal === 0 ? (
                <p className="text-white/40">
                  Nenhum comentário analisado ainda.
                </p>
              ) : (
                <>
                  <div className="flex h-3 rounded-full overflow-hidden bg-white/5 mb-5">
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${positivoPct}%` }}
                    />
                    <div
                      className="bg-amber-400"
                      style={{ width: `${neutroPct}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${negativoPct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <SentimentItem
                      icon={
                        <Smile className="w-4 h-4 text-emerald-400" />
                      }
                      label="Positivo"
                      value={summary.sentiment.positivo}
                      pct={positivoPct}
                      color="text-emerald-300"
                    />
                    <SentimentItem
                      icon={<Meh className="w-4 h-4 text-amber-300" />}
                      label="Neutro"
                      value={summary.sentiment.neutro}
                      pct={neutroPct}
                      color="text-amber-200"
                    />
                    <SentimentItem
                      icon={<Frown className="w-4 h-4 text-red-400" />}
                      label="Negativo"
                      value={summary.sentiment.negativo}
                      pct={negativoPct}
                      color="text-red-300"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-red-300" />
                <h2 className="text-lg font-semibold text-white">
                  Última consulta
                </h2>
              </div>

              {summary.latest_video ? (
                <div className="flex gap-4">
                  {summary.latest_video.thumbnail_url && (
                    <img
                      src={summary.latest_video.thumbnail_url}
                      alt={summary.latest_video.title}
                      className="w-36 h-24 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold line-clamp-2">
                      {summary.latest_video.title}
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      {summary.latest_video.channel}
                    </p>
                    <p className="text-xs text-white/40 mt-2">
                      Atualizado em{" "}
                      {formatDate(summary.latest_video.last_updated_at)}
                    </p>

                    <div className="flex gap-4 mt-3 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(summary.latest_video.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {formatNumber(summary.latest_video.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {formatNumber(summary.latest_video.comments)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-white/40">Nenhum vídeo consultado.</p>
              )}
            </div>
          </div>

          {summary.top_videos.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-300" />
                <h2 className="text-lg font-semibold text-white">
                  Top vídeos por views
                </h2>
              </div>

              <div className="space-y-3">
                {summary.top_videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3"
                  >
                    <span className="text-white/40 font-bold w-6 text-center shrink-0">
                      {index + 1}
                    </span>

                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-24 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-16 rounded-lg bg-white/5 border border-white/10 shrink-0" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium line-clamp-1">
                        {video.title}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {video.channel}
                      </p>
                    </div>

                    <div className="hidden sm:flex gap-4 text-xs text-white/60 shrink-0">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(video.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {formatNumber(video.likes)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
        {icon}
        {label}
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}

interface SentimentItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  pct: number;
  color: string;
}

function SentimentItem({
  icon,
  label,
  value,
  pct,
  color,
}: SentimentItemProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
        {icon}
        {label}
      </div>
      <p className={`text-lg font-semibold ${color}`}>
        {formatNumber(value)}{" "}
        <span className="text-xs text-white/40 font-normal">({pct}%)</span>
      </p>
    </div>
  );
}
