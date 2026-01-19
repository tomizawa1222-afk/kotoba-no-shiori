import Link from "next/link";
import { Home, Search, Plus, Book, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-md relative">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-1">
            <Home className="h-6 w-6" />
            <span className="text-[10px]">ホーム</span>
          </Button>
        </Link>
        
        <Link href="/search" passHref>
          <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-1">
            <Search className="h-6 w-6" />
            <span className="text-[10px]">検索</span>
          </Button>
        </Link>

        <div className="-mt-8">
          <Link href="/post" passHref>
            <Button variant="gradient" size="fab" className="shadow-lg hover:scale-105 transition-transform">
              <Plus className="h-8 w-8 text-black" />
            </Button>
          </Link>
        </div>

        <Link href="/bookshelf" passHref>
          <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-1">
            <Book className="h-6 w-6" />
            <span className="text-[10px]">本棚</span>
          </Button>
        </Link>

        <Link href="/profile" passHref>
          <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-1">
            <User className="h-6 w-6" />
            <span className="text-[10px]">マイページ</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}

