import React from 'react';
import { cn } from '@/app/lib/utils';
import { Home, Search, PlusCircle, Book, User } from 'lucide-react';
import Link from 'next/link';

// ナビゲーションアイテムの定義
const NAV_ITEMS = [
  { label: 'ホーム', icon: Home, href: '/' },
  { label: '検索', icon: Search, href: '/search' },
  { label: '投稿', icon: PlusCircle, href: '/post', isFab: true },
  { label: '本棚', icon: Book, href: '/bookshelf' },
  { label: 'マイページ', icon: User, href: '/profile' },
];

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary pb-safe-area shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-end h-16 max-w-md mx-auto relative">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          
          if (item.isFab) {
            return (
              <div key={item.href} className="relative -top-5">
                <Link href={item.href} className="flex flex-col items-center justify-center">
                  <div className="bg-accent-gradient rounded-full p-4 shadow-lg active:scale-95 transition-transform">
                    <Icon size={32} className="text-black" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] mt-1 font-medium text-gray-500">{item.label}</span>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full pb-2 active:opacity-70"
            >
              <Icon size={24} className="text-black mb-1" strokeWidth={1.5} />
              <span className="text-[10px] text-gray-500">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

