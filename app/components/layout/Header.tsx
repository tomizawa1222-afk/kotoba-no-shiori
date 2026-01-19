import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">言葉の栞</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <span className="sr-only">通知</span>
            🔔
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <span className="sr-only">検索</span>
            🔍
          </button>
        </div>
      </div>
    </header>
  );
}
