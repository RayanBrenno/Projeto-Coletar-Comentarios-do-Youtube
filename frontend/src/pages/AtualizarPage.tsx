import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { VideoResultCard } from "../components/VideoResultCard";
import { YoutubeCommentsList } from "../components/YoutubeCommentsList";

import {
  getApiErrorMessage,
  getYoutubeHistory,
  updateYoutubeVideoById,
} from "../services/youtubeService";

import {
  type HistoryVideo,
  type PreviousVideoStats,
  type UpdatedVideoViewState,
} from "../types/video";

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

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sortHistoryByLastUpdate(history: HistoryVideo[]) {
  return [...history].sort((a, b) => {
    const dateA = a.last_updated_at ? new Date(a.last_updated_at).getTime() : 0;

    const dateB = b.last_updated_at ? new Date(b.last_updated_at).getTime() : 0;

    return dateB - dateA;
  });
}

export function AtualizarPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const videoIdFromUrl = searchParams.get("videoId");

  const [history, setHistory] = useState<HistoryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingVideoId, setUpdatingVideoId] = useState<string | null>(null);
  const [autoUpdatedVideoId, setAutoUpdatedVideoId] = useState<string | null>(
    null,
  );

  const [updatedVideo, setUpdatedVideo] =
    useState<UpdatedVideoViewState | null>(null);

  async function fetchHistory() {
    if (!user?.id) {
      setError("Usuário não identificado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getYoutubeHistory(user.id);
      const sortedHistory = sortHistoryByLastUpdate(data);

      setHistory(sortedHistory);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      setError("Não foi possível carregar o histórico de vídeos.");
    } finally {
      setLoading(false);
    }
  }

  async function updateVideoById(videoId: string, beforeVideo?: HistoryVideo) {
    if (!user?.id) {
      setError("Usuário não identificado.");
      return;
    }

    try {
      setUpdatingVideoId(videoId);
      setError("");

      const data = await updateYoutubeVideoById(videoId, user.id);

      const beforeStats: PreviousVideoStats = beforeVideo
        ? {
            views: beforeVideo.views,
            likes: beforeVideo.likes,
            comments: beforeVideo.comments,
            last_updated_at: beforeVideo.last_updated_at,
          }
        : {
            views: data.previous?.views ?? 0,
            likes: data.previous?.likes ?? 0,
            comments: data.previous?.comments ?? 0,
            last_updated_at: data.previous?.last_updated_at ?? null,
          };

      setUpdatedVideo({
        before: beforeStats,
        after: data,
      });

      await fetchHistory();
    } catch (err) {
      console.error("Erro ao atualizar vídeo:", err);
      setError(
        getApiErrorMessage(err) || "Não foi possível atualizar o vídeo.",
      );
    } finally {
      setUpdatingVideoId(null);
    }
  }

  async function handleUpdateVideo(video: HistoryVideo) {
    await updateVideoById(video.idVideo, video);
  }

  function handleBackToList() {
    setUpdatedVideo(null);
  }

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    if (!videoIdFromUrl) return;
    if (autoUpdatedVideoId === videoIdFromUrl) return;

    setAutoUpdatedVideoId(videoIdFromUrl);
    updateVideoById(videoIdFromUrl);
  }, [user?.id, videoIdFromUrl, autoUpdatedVideoId]);

  if (updatedVideo) {
    const { before, after } = updatedVideo;

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Vídeo atualizado
            </h1>

            <p className="text-white/50">
              Comparativo entre a última atualização salva e os dados atuais.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBackToList}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
          >
            Voltar
          </button>
        </div>

        <div className="space-y-6">
          <VideoResultCard
            video={after.video}
            totalComments={after.total_comments}
            previousStats={{
              views: before.views,
              likes: before.likes,
              comments: before.comments,
              last_updated_at: before.last_updated_at,
            }}
          />

          <YoutubeCommentsList
            title="Comentários atuais"
            comments={after.comments}
            maxHeightClassName="max-h-[500px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-2">Atualizar</h1>

      <p className="text-white/50 mb-6">
        Aqui estão os vídeos já consultados. Atualize quando quiser sincronizar
        os dados mais recentes e visualizar o crescimento.
      </p>

      {videoIdFromUrl && updatingVideoId === videoIdFromUrl && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200">
          Atualizando o vídeo selecionado pela consulta...
        </div>
      )}

      {loading && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/70">
          Carregando histórico...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-white/40">
          Nenhum vídeo consultado ainda.
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="space-y-4">
          {history.map((video) => {
            const isUpdating = updatingVideoId === video.idVideo;

            return (
              <div
                key={video.idVideo}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-5 items-start"
              >
                <div className="md:w-[420px] lg:w-[480px] w-full shrink-0">
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

                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-lg leading-snug">
                      {video.title}
                    </p>

                    <p className="text-white/50">{video.channel}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-xs text-white/40">Publicado em</p>
                        <p className="text-sm text-white mt-1">
                          {formatDate(video.publish_date)}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-xs text-white/40">Views</p>
                        <p className="text-sm text-white mt-1">
                          {formatNumber(video.views)}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-xs text-white/40">Likes</p>
                        <p className="text-sm text-white mt-1">
                          {formatNumber(video.likes)}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-xs text-white/40">Comentários</p>
                        <p className="text-sm text-white mt-1">
                          {formatNumber(video.comments)}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-white/35 pt-2">
                      Última atualização:{" "}
                      {formatDateTime(video.last_updated_at)}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleUpdateVideo(video)}
                      disabled={isUpdating}
                      className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium transition-all"
                    >
                      {isUpdating ? "Atualizando..." : "Atualizar e comparar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
