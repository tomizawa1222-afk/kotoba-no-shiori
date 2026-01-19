import Image from 'next/image';
import { Post } from '@/app/types';
import { cn } from '@/app/lib/utils';

type PostCardProps = {
  post: Post;
  className?: string;
};

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article className={cn('bg-white p-6 border-b border-gray-100 last:border-0', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-100">
          <Image
            src={post.user.avatarUrl}
            alt={post.user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">{post.user.name}</span>
          <span className="text-xs text-gray-500">{post.createdAt}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-base leading-loose font-medium text-gray-900 whitespace-pre-wrap">
          “{post.content}”
        </p>
      </div>

      <div className="flex items-start gap-4 p-3 mb-4 bg-gray-50 rounded-lg">
        <div className="relative w-12 h-16 shrink-0 shadow-sm">
          <Image
            src={post.book.coverUrl}
            alt={post.book.title}
            fill
            className="object-cover rounded-sm"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">{post.book.title}</h3>
          <p className="text-xs text-gray-600">{post.book.author}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-500 pt-2">
        <button 
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors hover:text-pink-500",
            post.isLiked && "text-pink-500"
          )}
        >
          <span className="text-lg">{post.isLiked ? '♥' : '♡'}</span>
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-blue-500">
          <span className="text-lg">💬</span>
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-yellow-500">
          <span className="text-lg">🔖</span>
        </button>
      </div>
    </article>
  );
}
