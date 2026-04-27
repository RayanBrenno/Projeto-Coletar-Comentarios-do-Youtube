import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, X, RefreshCcw, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { VideoResultCard } from "../components/VideoResultCard";
import {
  checkVideoAlreadyConsulted,
  consultYoutubeVideo,
  getApiErrorMessage,
} from "../services/youtubeService";

import { type ConsultResponse, type ExistingVideo } from "../types/video";

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

export function ConsultarPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingVideo, setCheckingVideo] = useState(false);
  const [result, setResult] = useState<ConsultResponse | null>(null);
  const [error, setError] = useState("");

  const [showAlreadyConsultedModal, setShowAlreadyConsultedModal] =
    useState(false);

  const [existingVideo, setExistingVideo] = useState<ExistingVideo | null>(
    null,
  );

  async function consultVideo() {
    if (!user?.id) {
      setError("Usuário não identificado.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setError("");

      const data = await consultYoutubeVideo({
        url,
        user_id: user.id,
      });

      setResult(data);
    } catch (err) {
      setError(
        getApiErrorMessage(err) || "Não foi possível consultar o vídeo.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Por favor, insira a URL do vídeo.");
      return;
    }

    if (!user?.id) {
      setError("Usuário não identificado.");
      return;
    }

    try {
      setCheckingVideo(true);
      setResult(null);

      const data = await checkVideoAlreadyConsulted({
        url,
        user_id: user.id,
      });

      if (data.exists && data.video) {
        setExistingVideo(data.video);
        setShowAlreadyConsultedModal(true);
        return;
      }

      await consultVideo();
    } catch (err) {
      setError(
        getApiErrorMessage(err) || "Não foi possível verificar o vídeo.",
      );
    } finally {
      setCheckingVideo(false);
    }
  }

  async function handleContinueConsult() {
    setShowAlreadyConsultedModal(false);
    setExistingVideo(null);
    await consultVideo();
  }

  function handleCancelConsult() {
    setShowAlreadyConsultedModal(false);
    setExistingVideo(null);
  }

  function handleUpdateAndCompare() {
    if (!existingVideo?.id) {
      setError("Não foi possível identificar o vídeo para atualização.");
      setShowAlreadyConsultedModal(false);
      return;
    }

    navigate(`/atualizar?videoId=${existingVideo.id}`);
  }

  function handleNewConsult() {
    setUrl("");
    setResult(null);
    setError("");
    setLoading(false);
    setCheckingVideo(false);
    setExistingVideo(null);
    setShowAlreadyConsultedModal(false);
  }

  const sortedComments = result
    ? [...result.comments].sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;

        return dateB - dateA;
      })
    : [];

  const isBusy = loading || checkingVideo;

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
      {showAlreadyConsultedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl rounded-2xl border border-red-500/30 bg-gray-950 shadow-2xl shadow-red-950/40 overflow-hidden">
            <div className="bg-gradient-to-r from-red-950/80 via-gray-950 to-gray-950 px-6 py-5 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Vídeo já consultado
                    </h2>

                    <p className="text-sm text-white/50 mt-1">
                      Esse vídeo já existe no seu histórico de consultas.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancelConsult}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {existingVideo && (
                <div className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  {existingVideo.thumbnail_url && (
                    <img
                      src={existingVideo.thumbnail_url}
                      alt={existingVideo.title}
                      className="w-28 h-20 rounded-lg object-cover border border-white/10"
                    />
                  )}

                  <div className="min-w-0">
                    <p className="text-white font-semibold line-clamp-2">
                      {existingVideo.title}
                    </p>

                    <p className="text-sm text-white/50 mt-1">
                      {existingVideo.channel}
                    </p>

                    <p className="text-xs text-white/35 mt-2">
                      Última consulta:{" "}
                      {formatDate(
                        existingVideo.last_updated_at ||
                          existingVideo.consulted_at,
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm leading-relaxed">
                <p className="text-white/70">
                  Se você continuar com uma consulta simples, o sistema vai
                  exibir os dados atuais do vídeo normalmente.
                </p>

                <p className="text-red-300/90">
                  Porém, essa consulta não mostrará o comparativo de crescimento
                  desde a última consulta, como aumento de views, likes e
                  comentários.
                </p>

                <p className="text-white/50">
                  Para ver o comparativo, use a opção de atualização.
                </p>
              </div>
            </div>

            <div className="px-6 py-5 bg-white/[0.03] border-t border-white/10 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelConsult}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleContinueConsult}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Continuar consulta
              </button>

              <button
                type="button"
                onClick={handleUpdateAndCompare}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Atualizar e comparar
              </button>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <>
          <h1 className="text-2xl font-bold text-white mb-2">Consultar</h1>

          <p className="text-white/50 mb-6">
            Informe a URL do vídeo para consultar os dados e comentários.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">
                URL do vídeo
              </label>

              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-red-500"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isBusy}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium transition-all"
            >
              {checkingVideo
                ? "Verificando..."
                : loading
                  ? "Consultando..."
                  : "Consultar"}
            </button>
          </form>
        </>
      )}

      {loading && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4 text-white/70">
          Carregando informações do vídeo e comentários...
        </div>
      )}

      {!loading && result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Vídeo consultado
              </h1>

              <p className="text-white/50">
                Informações do vídeo consultado e comentários encontrados.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewConsult}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
            >
              Nova consulta
            </button>
          </div>

          <VideoResultCard
            video={result.video}
            totalComments={result.total_comments}
          />

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Comentários
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
      )}
    </div>
  );
}
