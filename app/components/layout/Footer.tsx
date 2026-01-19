import Link from 'next/link';

export function Footer() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white pb-safe">
      <div className="container mx-auto flex h-16 items-center justify-around px-4">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-black">
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">ホーム</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-black">
          <span className="text-xl">🔍</span>
          <span className="text-[10px]">検索</span>
        </Link>
        <div className="relative -top-5">
          <Link href="/post" className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FFFC00] to-[#FFA500] shadow-lg transition-transform hover:scale-105 active:scale-95">
            <span className="text-2xl font-bold text-black">＋</span>
          </Link>
        </div>
        <Link href="/bookshelf" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-black">
          <span className="text-xl">📚</span>
          <span className="text-[10px]">本棚</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-black">
          <span className="text-xl">👤</span>
          <span className="text-[10px]">マイページ</span>
        </Link>
      </div>
    </nav>
  );
}
