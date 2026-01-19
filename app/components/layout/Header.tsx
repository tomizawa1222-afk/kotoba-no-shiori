import Link from 'next/link';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from '@/app/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">言葉の栞</span>
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <span className="sr-only">通知</span>
              🔔
            </button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button size="sm" variant="secondary">ログイン</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">登録</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
