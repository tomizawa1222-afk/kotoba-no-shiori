import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';
import { mockPosts } from '@/app/lib/mock-data';
import { PostCard } from '@/app/components/ui/PostCard';

export default function ProfilePage() {
  const user = {
    name: '読書 太郎',
    id: '@book_taro',
    bio: '本の虫です。特に純文学とミステリーが好き。積読消化中。',
    avatar: 'https://i.pravatar.cc/150?u=user1',
    stats: {
      posts: 42,
      likes: 128,
      books: 15,
    },
  };

  return (
    <div>
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative w-24 h-24 mb-4 rounded-full border-2 border-white shadow-lg overflow-hidden">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-xl font-bold mb-1">{user.name}</h1>
        <p className="text-sm text-gray-500 mb-4">{user.id}</p>
        <p className="text-sm text-center text-gray-700 max-w-sm mb-6 px-4">
          {user.bio}
        </p>

        <div className="flex gap-8 mb-8 w-full justify-center border-y border-gray-100 py-4">
          <div className="text-center">
            <div className="font-bold text-lg">{user.stats.posts}</div>
            <div className="text-xs text-gray-500">投稿</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{user.stats.likes}</div>
            <div className="text-xs text-gray-500">いいね</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{user.stats.books}</div>
            <div className="text-xs text-gray-500">読了</div>
          </div>
        </div>

        <Button variant="secondary" className="w-full max-w-xs">
          プロフィール編集
        </Button>
      </div>

      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 flex">
        <button className="flex-1 py-3 text-sm font-bold border-b-2 border-[#FFFC00]">
          投稿
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-500">
          いいね
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-500">
          本棚
        </button>
      </div>

      <div className="flex flex-col gap-4 py-4">
        {mockPosts.map((post) => (
          <PostCard key={`profile-${post.id}`} post={post} />
        ))}
      </div>
    </div>
  );
}

