import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-md">
        <Link href="/" className="font-bold text-lg tracking-tight">
          言葉の栞
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="検索">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="通知">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
