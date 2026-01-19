import Link from "next/link";
import { Home, Search, BookOpen, User, Plus } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg pb-safe">
      <div className="container mx-auto flex h-16 items-center justify-around px-4">
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px]">ホーム</span>
        </Link>
        <Link
          href="/search"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Search className="h-6 w-6" />
          <span className="text-[10px]">検索</span>
        </Link>
        <div className="relative -top-5">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gradient shadow-lg transition-transform hover:scale-105 active:scale-95">
            <Plus className="h-8 w-8 text-black" />
          </button>
        </div>
        <Link
          href="/bookshelf"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <BookOpen className="h-6 w-6" />
          <span className="text-[10px]">本棚</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <User className="h-6 w-6" />
          <span className="text-[10px]">マイページ</span>
        </Link>
      </div>
    </nav>
  );
}

