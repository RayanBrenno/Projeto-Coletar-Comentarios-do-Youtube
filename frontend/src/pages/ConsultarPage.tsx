import { useState, type FormEvent } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { VideoResultCard } from "../components/VideoResultCard";
import { type ConsultResponse } from "../types/video";

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

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultResponse | null>(null);
  const [error, setError] = useState("");

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
      setLoading(true);
      setResult(null);

      const { data } = await api.post<ConsultResponse>("/youtube/full-data", {
        url,
        user_id: user.id,
      });

      setResult(data);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;

      let message = "Não foi possível consultar o vídeo.";

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

  const sortedComments = result
    ? [...result.comments].sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;

        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;

        return dateB - dateA;
      })
    : [];

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
