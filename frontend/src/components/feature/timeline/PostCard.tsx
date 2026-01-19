import Image from "next/image";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Quote } from "@/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  quote: Quote;
}

export function PostCard({ quote }: PostCardProps) {
  return (
    <article className="bg-white p-4 border-b border-gray-100 last:border-b-0">
      {/* Header: User Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
          {quote.user.avatarUrl ? (
            <Image
              src={quote.user.avatarUrl}
              alt={quote.user.displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
              NO IMG
            </div>
          )}
        </div>
        <div>
          <div className="font-bold text-sm">{quote.user.displayName}</div>
          <div className="text-xs text-gray-500">@{quote.user.username} • 2時間前</div>
        </div>
      </div>

      {/* Body: Quote Content */}
      <div className="mb-4">
        <p className="text-quote whitespace-pre-wrap text-gray-900 leading-relaxed">
          {quote.content}
        </p>
      </div>

      {/* Book Info */}
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mb-4 cursor-pointer hover:bg-gray-100 transition-colors">
        <div className="relative w-12 h-16 bg-gray-200 flex-shrink-0 shadow-sm">
          {quote.book.coverUrl ? (
            <Image
              src={quote.book.coverUrl}
              alt={quote.book.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
              No Cover
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold line-clamp-1">{quote.book.title}</h3>
          <p className="text-xs text-gray-600 line-clamp-1">{quote.book.author}</p>
          {quote.pageNumber && (
            <p className="text-xs text-gray-400 mt-1">p.{quote.pageNumber}</p>
          )}
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2 gap-1.5 hover:text-pink-500 hover:bg-pink-50">
            <Heart className={cn("h-5 w-5", quote.isLikedByCurrentUser && "fill-pink-500 text-pink-500")} />
            <span className="text-xs">{quote.likesCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5">
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">2</span>
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bookmark className="h-5 w-5" />
        </Button>
      </div>
    </article>
  );
}

