import { useState } from "react";

export function ConsultarPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<any>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Por favor, insira a URL do vídeo.");
      return;
    }

    setLoading(true);

    // simulação mínima só para manter o fluxo funcionando
    setTimeout(() => {
      setVideo({
        title: "Vídeo de exemplo",
        channel: "Canal exemplo",
      });
      setLoading(false);
    }, 800);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Consultar
      </h1>

      <p className="text-white/50 mb-6">
        Aqui ficará a consulta de vídeos.
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

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium transition-all"
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>

      {!loading && !video && (
        <div className="mt-8 text-white/30">
          Nenhum vídeo consultado ainda.
        </div>
      )}

      {!loading && video && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-2">
            Resultado
          </h2>
          <p className="text-white/70">
            <strong>Título:</strong> {video.title}
          </p>
          <p className="text-white/70">
            <strong>Canal:</strong> {video.channel}
          </p>
        </div>
      )}
    </div>
  );
}