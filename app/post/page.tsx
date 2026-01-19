import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

export default function PostPage() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-100">
        <Link href="/" className="p-2 -ml-2 text-gray-500 hover:text-black">
          ✕ <span className="sr-only">キャンセル</span>
        </Link>
        <Button className="px-6">投稿する</Button>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <textarea
          placeholder="心に刺さった言葉を入力..."
          className="w-full min-h-[200px] text-lg leading-relaxed resize-none outline-none placeholder:text-gray-300"
          autoFocus
        />

        <div className="space-y-4 mt-8">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors group">
            <span className="text-gray-500 group-hover:text-black font-medium">
              📖 書籍を選択してください
            </span>
            <span className="text-gray-400">›</span>
          </button>

          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="ページ数 (任意)"
              className="flex-1 p-4 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-[#FFFC00]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-[#FFFC00] hover:text-black transition-colors">
              🏷️ #タグを追加
            </button>
          </div>
        </div>
      </main>

      <footer className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-full">
            🌐 全体公開
            <span className="text-xs">▼</span>
          </button>
          <span>0 / 500</span>
        </div>
      </footer>
    </div>
  );
}

