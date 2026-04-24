import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { VideoResultCard } from "../components/VideoResultCard";
import {
  type HistoryVideo,
  type ConsultResponse,
  type UpdatedVideoState,
} from "../types/video";

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function AtualizarPage() {
  const { user } = useAuth();

  const [history, setHistory] = useState<HistoryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingVideoId, setUpdatingVideoId] = useState<string | null>(null);
  const [updatedVideo, setUpdatedVideo] = useState<UpdatedVideoState | null>(
    null,
  );

  async function fetchHistory() {
    if (!user?.id) {
      setError("Usuário não identificado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.get<HistoryVideo[]>(
        `/youtube/history/${user.id}`,
      );

      const sortedHistory = Array.isArray(data)
        ? [...data].sort((a, b) => {
            const dateA = a.last_updated_at
              ? new Date(a.last_updated_at).getTime()
              : 0;
            const dateB = b.last_updated_at
              ? new Date(b.last_updated_at).getTime()
              : 0;

            return dateB - dateA;
          })
        : [];

      setHistory(sortedHistory);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      setError("Não foi possível carregar o histórico de vídeos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateVideo(video: HistoryVideo) {
    if (!user?.id) {
      setError("Usuário não identificado.");
      return;
    }

    try {
      setUpdatingVideoId(video.idVideo);
      setError("");

      const { data } = await api.post<ConsultResponse>("/youtube/full-data", {
        url: `https://www.youtube.com/watch?v=${video.codeURL}`,
        user_id: user.id,
      });

      setUpdatedVideo({
        before: video,
        after: data,
      });

      await fetchHistory();
    } catch (err) {
      console.error("Erro ao atualizar vídeo:", err);
      setError("Não foi possível atualizar o vídeo selecionado.");
    } finally {
      setUpdatingVideoId(null);
    }
  }

  function handleBackToList() {
    setUpdatedVideo(null);
  }

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  if (updatedVideo) {
    const { before, after } = updatedVideo;

    const sortedComments = [...after.comments].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;

      return dateB - dateA;
    });

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
              lastUpdatedAt: before.last_updated_at,
            }}
          />

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Comentários atuais
            </h2>

            {sortedComments.length === 0 ? (
              <p className="text-white/40">Nenhum comentário encontrado.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {sortedComments.map((comment, index) => (
                  <div
                    key={`${comment.id ?? comment.author}-${comment.published_at}-${index}`}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="text-white font-medium truncate">
                        {comment.author}
                      </p>

                      <span className="text-xs text-white/40 shrink-0">
                        {formatDate(comment.published_at)}
                      </span>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.text}
                    </p>

                    <p className="text-xs text-white/40 mt-3">
                      Likes: {formatNumber(comment.likes)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-2">Atualizar</h1>

      <p className="text-white/50 mb-6">
        Aqui estão os vídeos já consultados. Atualize quando quiser sincronizar
        os dados mais recentes.
      </p>

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
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-5 items-stretch"
              >
                <div className="md:w-[320px] w-full shrink-0">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full min-h-[220px] rounded-xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[220px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/30">
                      Thumbnail indisponível
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-lg leading-snug">
                      {video.title}
                    </p>

                    <p className="text-white/70">
                      <strong className="text-white">Canal:</strong>{" "}
                      {video.channel}
                    </p>

                    <p className="text-white/70">
                      <strong className="text-white">
                        Última atualização:
                      </strong>{" "}
                      {formatDateTime(video.last_updated_at)}
                    </p>
                  </div>

                  <div className="flex md:justify-end">
                    <button
                      type="button"
                      onClick={() => handleUpdateVideo(video)}
                      disabled={isUpdating}
                      className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium transition-all"
                    >
                      {isUpdating ? "Atualizando..." : "Atualizar"}
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
