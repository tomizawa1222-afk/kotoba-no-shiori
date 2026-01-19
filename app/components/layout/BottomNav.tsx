import React from 'react'
import Link from 'next/link'
import { Home, Search, PlusCircle, Book, User } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
}

export function BottomNav() {
  const navItems: NavItem[] = [
    { href: '/home', icon: Home, label: 'ホーム', active: true },
    { href: '/search', icon: Search, label: '検索' },
    { href: '/new', icon: PlusCircle, label: '投稿' }, // モーダルにする予定だが一旦ページ遷移
    { href: '/bookshelf', icon: Book, label: '本棚' },
    { href: '/profile', icon: User, label: 'マイページ' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white pb-safe pt-2 md:hidden">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item, index) => {
          const isCenter = index === 2
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
                item.active ? "text-black" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {isCenter ? (
                 <div className="bg-accent-gradient rounded-full p-3 -mt-6 shadow-lg">
                   <item.icon className="h-6 w-6 text-black" />
                 </div>
              ) : (
                <>
                  <item.icon className="h-6 w-6 mb-1" />
                  <span>{item.label}</span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
