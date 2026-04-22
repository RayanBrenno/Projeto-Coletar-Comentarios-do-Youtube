import { useState } from "react";

export function AtualizarPage() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  // mock simples só pra não quebrar
  const history: any[] = [];

  if (selectedVideo) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Detalhes do Vídeo
        </h1>

        <p className="text-white/50 mb-4">
          Aqui vai aparecer o detalhe do vídeo selecionado.
        </p>

        <button
          onClick={() => setSelectedVideo(null)}
          className="px-4 py-2 bg-red-600 rounded-lg text-white"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Histórico</h1>

      <p className="text-white/50 mb-6">
        Aqui ficarão os vídeos consultados anteriormente.
      </p>

      {history.length === 0 ? (
        <p className="text-white/30">Nenhum vídeo consultado ainda.</p>
      ) : (
        <div className="space-y-2">
          {history.map((video, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideo(video)}
              className="w-full text-left p-4 bg-white/5 rounded-lg hover:bg-white/10"
            >
              Vídeo {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
