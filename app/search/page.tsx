import { Button } from '@/app/components/ui/Button';

export default function SearchPage() {
  const trendingTags = ['人生', 'ミステリー', '恋愛', '哲学', 'ビジネス', 'エッセイ', '詩歌', '自己啓発'];
  const trendingBooks = [
    { title: '人間失格', author: '太宰 治', cover: 'https://placehold.co/128x182?text=Book1' },
    { title: 'こころ', author: '夏目 漱石', cover: 'https://placehold.co/128x182?text=Book2' },
    { title: '星の王子さま', author: 'サン=テグジュペリ', cover: 'https://placehold.co/128x182?text=Book3' },
  ];

  return (
    <div className="space-y-8">
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm -mx-4 px-4 py-2">
        <div className="relative">
          <input
            type="search"
            placeholder="キーワード検索..."
            className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-[#FFFC00] outline-none transition-shadow"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-4">トレンドのタグ</h2>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Button
              key={tag}
              variant="secondary"
              className="rounded-full px-4 py-2 text-sm hover:border-[#FFFC00] transition-colors"
            >
              #{tag}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">注目の本</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {trendingBooks.map((book) => (
            <div key={book.title} className="flex-shrink-0 w-32 space-y-2">
              <div className="relative aspect-[2/3] rounded shadow-sm overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold truncate">{book.title}</h3>
                <p className="text-xs text-gray-500 truncate">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

