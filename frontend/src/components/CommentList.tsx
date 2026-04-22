import { ThumbsUp, MessageCircle } from 'lucide-react';
import { type Comment } from '../types/comment';

interface CommentListProps {
  comments: Comment[];
  total: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getAvatarColor(initials: string): string {
  const colors = [
    'bg-red-500',
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-red-700',
    'bg-rose-700',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

function CommentItem({ comment }: { comment: Comment }) {
  const color = getAvatarColor(comment.avatar);
  return (
    <div className="flex gap-3 py-5 border-b border-gray-100 last:border-0 group">
      <div className={`flex-shrink-0 w-9 h-9 rounded-full ${color} flex items-center justify-center shadow-sm`}>
        <span className="text-white text-xs font-bold">{comment.avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{comment.author}</span>
          <span className="text-xs text-gray-400">{formatDate(comment.publishedAt)}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <ThumbsUp size={13} className="text-red-400" />
          <span className="text-xs text-gray-500 font-medium">{comment.likes.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}

export function CommentList({ comments, total }: CommentListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={17} className="text-red-500" />
          <h2 className="font-semibold text-gray-800 text-sm">Comentários</h2>
        </div>
        <span className="text-xs bg-red-50 text-red-600 font-semibold px-3 py-1 rounded-full border border-red-100">
          {total.toLocaleString('pt-BR')} comentários
        </span>
      </div>

      {comments.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <MessageCircle size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Nenhum comentário disponível</p>
        </div>
      ) : (
        <div className="px-6 divide-y divide-gray-50">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {comments.length < total && (
        <div className="px-6 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Exibindo {comments.length} de {total.toLocaleString('pt-BR')} comentários
          </p>
        </div>
      )}
    </div>
  );
}
