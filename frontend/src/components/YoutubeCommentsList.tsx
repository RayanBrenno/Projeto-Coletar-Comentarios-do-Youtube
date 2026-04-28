import { MessageCircle } from "lucide-react";
import { type YoutubeComment, type YoutubeCommentsListProps } from "../types/comment";

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

function getCommentDate(comment: YoutubeComment) {
  return comment.published_at ?? comment.publishedAt ?? null;
}

function sortCommentsByDate(comments: YoutubeComment[]) {
  return [...comments].sort((a, b) => {
    const dateA = getCommentDate(a)
      ? new Date(getCommentDate(a) as string).getTime()
      : 0;

    const dateB = getCommentDate(b)
      ? new Date(getCommentDate(b) as string).getTime()
      : 0;

    return dateB - dateA;
  });
}

function formatIntencao(value?: string | null) {
  if (!value) return "não classificada";

  return value;
}

function formatScore(value?: number | null) {
  if (typeof value !== "number") return null;

  return value.toFixed(2);
}

export function YoutubeCommentsList({
  title = "Comentários atuais",
  comments,
  maxHeightClassName = "max-h-[500px]",
}: YoutubeCommentsListProps) {
  const sortedComments = sortCommentsByDate(comments);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-red-300" />

        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      {sortedComments.length === 0 ? (
        <p className="text-white/40">Nenhum comentário encontrado.</p>
      ) : (
        <div
          className={`space-y-4 overflow-y-auto overflow-x-hidden pr-1 ${maxHeightClassName}`}
        >
          {sortedComments.map((comment, index) => {
            const publishedAt = getCommentDate(comment);
            const score = formatScore(comment.score);

            return (
              <div
                key={`${comment.id ?? comment.author}-${publishedAt}-${index}`}
                className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-0"
              >
                <div className="flex items-center justify-between gap-4 mb-2 min-w-0">
                  <p className="text-white font-medium truncate min-w-0">
                    {comment.author}
                  </p>

                  <span className="text-xs text-white/40 shrink-0">
                    {formatDate(publishedAt)}
                  </span>
                </div>

                <p
                  className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap break-words"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {comment.text}
                </p>

                <p className="text-xs text-red-300 mt-3">
                  Intenção: {formatIntencao(comment.intencao)}
                  {score && ` - Score: ${score}`}
                </p>

                <p className="text-xs text-white/40 mt-2">
                  Likes: {formatNumber(comment.likes)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
