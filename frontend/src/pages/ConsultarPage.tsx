import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

type VideoData = {
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

type CommentData = {
  author: string;
  text: string;
  likes: number;
  published_at: string;
};

type ConsultResponse = {
  video_id: string;
  video: VideoData;
  total_comments: number;
  comments: CommentData[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value: string) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  if (!value) return "-";

  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConsultarPage() {
  const { user } = useAuth();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultResponse | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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
      setLoading(true);
      setResult(null);

      const { data } = await api.post<ConsultResponse>("/youtube/full-data", {
        url,
        user_id: user.id,
      });

      setResult(data);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;

      let message = "Não foi possível consultar o vídeo. Tente novamente.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        message = detail[0]?.msg || message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleNewConsult() {
    setUrl("");
    setResult(null);
    setError("");
    setLoading(false);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
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
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium transition-all"
            >
              {loading ? "Consultando..." : "Consultar"}
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
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Resultado</h2>

            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <div className="md:w-[380px] w-full shrink-0">
                {result.video.thumbnail_url ? (
                  <img
                    src={result.video.thumbnail_url}
                    alt={result.video.title}
                    className="w-full h-full rounded-xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="w-full h-full min-h-[220px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/30">
                    Thumbnail indisponível
                  </div>
                )}
              </div>

              <div className="space-y-2 text-white/70 flex-1">
                <p>
                  <strong className="text-white">Título:</strong>{" "}
                  {result.video.title}
                </p>
                <p>
                  <strong className="text-white">Canal:</strong>{" "}
                  {result.video.channel}
                </p>
                <p>
                  <strong className="text-white">Publicação:</strong>{" "}
                  {formatDate(result.video.publish_date)}
                </p>
                <p>
                  <strong className="text-white">Última atualização:</strong>{" "}
                  {formatDateTime(result.video.last_updated_at || "")}
                </p>
                <p>
                  <strong className="text-white">Views:</strong>{" "}
                  {formatNumber(result.video.views)}
                </p>
                <p>
                  <strong className="text-white">Likes:</strong>{" "}
                  {formatNumber(result.video.likes)}
                </p>
                <p>
                  <strong className="text-white">Comentários no vídeo:</strong>{" "}
                  {formatNumber(result.video.comments)}
                </p>
                <p>
                  <strong className="text-white">
                    Comentários carregados:
                  </strong>{" "}
                  {formatNumber(result.total_comments)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Comentários
            </h2>

            {result.comments.length === 0 ? (
              <p className="text-white/40">Nenhum comentário encontrado.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {result.comments
                .sort((a, b) => {
                  const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
                  const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
                  return dateB - dateA;
                }).map((comment, index) => (
                  <div
                    key={`${comment.author}-${comment.published_at}-${index}`}
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

      {result && !loading && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleNewConsult}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium transition-all"
          >
            Nova consulta
          </button>
        </div>
      )}
    </div>
  );
}
