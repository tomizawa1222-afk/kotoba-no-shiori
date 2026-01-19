export default function BookshelfPage() {
  const books = [
    { title: '人間失格', author: '太宰 治', cover: 'https://placehold.co/128x182?text=Read', status: 'read' },
    { title: 'ノルウェイの森', author: '村上 春樹', cover: 'https://placehold.co/128x182?text=Reading', status: 'reading' },
    { title: 'こころ', author: '夏目 漱石', cover: 'https://placehold.co/128x182?text=Want', status: 'want_to_read' },
    // ダミーデータ追加
    { title: '銀河鉄道の夜', author: '宮沢 賢治', cover: 'https://placehold.co/128x182?text=Book4', status: 'read' },
    { title: '羅生門', author: '芥川 龍之介', cover: 'https://placehold.co/128x182?text=Book5', status: 'read' },
  ];

  const statusLabels = {
    read: '読了',
    reading: '読書中',
    want_to_read: '積読',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold px-2">本棚</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-sm font-medium hover:bg-gray-200 transition-colors first:bg-black first:text-white"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 px-2">
        {books.map((book, i) => (
          <div key={i} className="flex flex-col gap-2 group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-sm transition-transform group-hover:scale-105">
              <img
                src={book.cover}
                alt={book.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-1 right-1">
                <span className="inline-block w-3 h-3 rounded-full bg-[#FFFC00] border border-white/50 shadow-sm" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold truncate">{book.title}</h3>
              <p className="text-xs text-gray-500 truncate">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

