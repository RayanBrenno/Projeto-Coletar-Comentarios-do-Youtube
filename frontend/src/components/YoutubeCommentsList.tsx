import { useMemo, useState } from "react";
import { MessageCircle, Search, X } from "lucide-react";
import {
  type YoutubeComment,
  type YoutubeCommentsListProps,
} from "../types/comment";

type IntencaoFilter = "todos" | "positivo" | "neutro" | "negativo";
type SortOption = "date_desc" | "date_asc" | "likes_desc" | "likes_asc";

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

function getCommentTime(value?: string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatIntencao(value?: string | null) {
  if (!value) return "não classificada";
  return value;
}

function formatScore(value?: number | null) {
  if (typeof value !== "number") return null;
  return value.toFixed(2);
}

function getIntencaoColor(intencao?: string | null) {
  const key = (intencao || "").toLowerCase();

  if (key === "positivo") return "text-emerald-300";
  if (key === "negativo") return "text-red-300";
  if (key === "neutro") return "text-amber-200";

  return "text-white/50";
}

const INTENCAO_OPTIONS: { value: IntencaoFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "positivo", label: "Positivo" },
  { value: "neutro", label: "Neutro" },
  { value: "negativo", label: "Negativo" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date_desc", label: "Mais recentes" },
  { value: "date_asc", label: "Mais antigos" },
  { value: "likes_desc", label: "Mais curtidos" },
  { value: "likes_asc", label: "Menos curtidos" },
];

export function YoutubeCommentsList({
  title = "Comentários atuais",
  comments,
  maxHeightClassName = "max-h-[500px]",
}: YoutubeCommentsListProps) {
  const [search, setSearch] = useState("");
  const [intencaoFilter, setIntencaoFilter] =
    useState<IntencaoFilter>("todos");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  const visibleComments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = comments.filter((comment) => {
      if (intencaoFilter !== "todos") {
        const key = (comment.intencao || "").toLowerCase();
        if (key !== intencaoFilter) return false;
      }

      if (normalizedSearch) {
        const haystack = `${comment.author} ${comment.text}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "date_desc") {
        return getCommentTime(b.published_at) - getCommentTime(a.published_at);
      }
      if (sortBy === "date_asc") {
        return getCommentTime(a.published_at) - getCommentTime(b.published_at);
      }
      if (sortBy === "likes_desc") {
        return (b.likes || 0) - (a.likes || 0);
      }
      return (a.likes || 0) - (b.likes || 0);
    });
  }, [comments, search, intencaoFilter, sortBy]);

  const hasActiveFilters =
    search.trim() !== "" || intencaoFilter !== "todos";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-red-300" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>

        <span className="text-xs text-white/40">
          {formatNumber(visibleComments.length)} de{" "}
          {formatNumber(comments.length)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por autor ou texto..."
            className="w-full pl-10 pr-9 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={intencaoFilter}
          onChange={(e) =>
            setIntencaoFilter(e.target.value as IntencaoFilter)
          }
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-red-500"
        >
          {INTENCAO_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-900"
            >
              Intenção: {option.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-red-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-900"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {visibleComments.length === 0 ? (
        <p className="text-white/40">
          {hasActiveFilters
            ? "Nenhum comentário corresponde aos filtros aplicados."
            : "Nenhum comentário encontrado."}
        </p>
      ) : (
        <div
          className={`space-y-4 overflow-y-auto overflow-x-hidden pr-1 ${maxHeightClassName}`}
        >
          {visibleComments.map((comment, index) => {
            const publishedAt = comment.published_at ?? null;
            const score = formatScore(comment.score);
            const intencaoColor = getIntencaoColor(comment.intencao);

            return (
              <CommentItem
                key={`${comment.id ?? comment.author}-${publishedAt}-${index}`}
                comment={comment}
                publishedAt={publishedAt}
                score={score}
                intencaoColor={intencaoColor}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: YoutubeComment;
  publishedAt: string | null;
  score: string | null;
  intencaoColor: string;
}

function CommentItem({
  comment,
  publishedAt,
  score,
  intencaoColor,
}: CommentItemProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-0">
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

      <p className={`text-xs mt-3 ${intencaoColor}`}>
        Intenção: {formatIntencao(comment.intencao)}
        {score && ` - Score: ${score}`}
      </p>

      <p className="text-xs text-white/40 mt-2">
        Likes: {formatNumber(comment.likes)}
      </p>
    </div>
  );
}
