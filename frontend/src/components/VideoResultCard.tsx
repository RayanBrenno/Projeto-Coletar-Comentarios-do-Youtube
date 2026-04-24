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

function getDelta(current: number, previous?: number) {
  if (previous === undefined) return null;

  const delta = current - previous;

  if (delta > 0) return `(+${formatNumber(delta)})`;
  if (delta < 0) return `(${formatNumber(delta)})`;
  return "(0)";
}

interface VideoResultCardProps {
  video: {
    title: string;
    channel: string;
    publish_date: string;
    views: number;
    likes: number;
    comments: number;
    thumbnail_url?: string | null;
    last_updated_at?: string | null;
  };
  totalComments: number;

  previousStats?: {
    views: number;
    likes: number;
    comments: number;
    lastUpdatedAt?: string | null;
  };
}

export function VideoResultCard({
  video,
  totalComments,
  previousStats,
}: VideoResultCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white mb-4">Resultado</h2>

      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Thumbnail */}
        <div className="md:w-[380px] w-full shrink-0">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full rounded-xl border border-white/10 object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[220px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/30">
              Thumbnail indisponível
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="space-y-2 text-white/70 flex-1">
          <p>
            <strong className="text-white">Título:</strong> {video.title}
          </p>

          <p>
            <strong className="text-white">Canal:</strong> {video.channel}
          </p>

          <p>
            <strong className="text-white">Publicação:</strong>{" "}
            {formatDate(video.publish_date)}
          </p>

          {previousStats && (
            <p>
              <strong className="text-white">
                Última atualização anterior:
              </strong>{" "}
              {formatDateTime(previousStats.lastUpdatedAt)}
            </p>
          )}

          <p>
            <strong className="text-white">Última atualização:</strong>{" "}
            {formatDateTime(video.last_updated_at)}
          </p>

          {/* Views */}
          <p>
            <strong className="text-white">Views:</strong>{" "}
            {formatNumber(video.views)}{" "}
            {previousStats && (
              <span className="text-green-400">
                {getDelta(video.views, previousStats.views)}
              </span>
            )}
          </p>

          {/* Likes */}
          <p>
            <strong className="text-white">Likes:</strong>{" "}
            {formatNumber(video.likes)}{" "}
            {previousStats && (
              <span className="text-green-400">
                {getDelta(video.likes, previousStats.likes)}
              </span>
            )}
          </p>

          {/* Comentários do vídeo */}
          <p>
            <strong className="text-white">Comentários no vídeo:</strong>{" "}
            {formatNumber(video.comments)}{" "}
            {previousStats && (
              <span className="text-green-400">
                {getDelta(video.comments, previousStats.comments)}
              </span>
            )}
          </p>

          {/* Comentários carregados */}
          <p>
            <strong className="text-white">Comentários carregados:</strong>{" "}
            {formatNumber(totalComments)}
          </p>
        </div>
      </div>
    </div>
  );
}