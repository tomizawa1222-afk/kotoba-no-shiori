import { mockPosts } from '@/app/lib/mock-data';
import { PostCard } from '@/app/components/ui/PostCard';

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="flex sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 -mx-4 px-4 mb-4">
        <button className="flex-1 py-3 text-sm font-bold border-b-2 border-[#FFFC00] text-black">
          おすすめ
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-black transition-colors">
          フォロー中
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {/* モックデータを複製してリストを長く見せる */}
        {mockPosts.map((post) => (
          <PostCard key={`${post.id}-dup`} post={{ ...post, id: `${post.id}-dup` }} />
        ))}
      </div>
    </div>
  );
}
