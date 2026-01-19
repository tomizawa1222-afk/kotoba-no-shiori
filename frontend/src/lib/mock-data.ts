import { Quote, User, Book } from '@/types';

export const mockCurrentUser: User = {
  id: 'user-1',
  username: 'reading_lover',
  displayName: '栞',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  bio: '本と言葉が好きです。',
};

export const mockBooks: Book[] = [
  {
    isbn: '9784101001011',
    title: 'こころ',
    author: '夏目漱石',
    coverUrl: 'https://books.google.com/books/content?id=kxWzAAAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    publisher: '新潮社',
  },
  {
    isbn: '9784061311111',
    title: 'ノルウェイの森',
    author: '村上春樹',
    publisher: '講談社',
  },
  {
    isbn: '9784167106012',
    title: '人間失格',
    author: '太宰治',
    coverUrl: 'https://books.google.com/books/content?id=1234567890&printsec=frontcover&img=1&zoom=1&source=gbs_api', // 仮URL
    publisher: '新潮社',
  }
];

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    username: 'book_worm',
    displayName: '本の虫',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  },
  {
    id: 'user-3',
    username: 'philosopher',
    displayName: '考える葦',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'quote-1',
    content: '精神的に向上心のないものは馬鹿だ。',
    pageNumber: 124,
    privacy: 'public',
    createdAt: '2026-01-19T10:00:00Z',
    user: mockUsers[0],
    book: mockBooks[0],
    likesCount: 15,
    isLikedByCurrentUser: false,
    tags: ['人生', '古典'],
  },
  {
    id: 'quote-2',
    content: '死は生の対極としてではなく、その一部として存在している。',
    pageNumber: 45,
    privacy: 'public',
    createdAt: '2026-01-18T15:30:00Z',
    user: mockUsers[1],
    book: mockBooks[1],
    likesCount: 32,
    isLikedByCurrentUser: true,
    tags: ['小説', '村上春樹'],
  },
  {
    id: 'quote-3',
    content: '恥の多い生涯を送って来ました。',
    privacy: 'public',
    createdAt: '2026-01-18T09:00:00Z',
    user: mockUsers[2],
    book: mockBooks[2],
    likesCount: 8,
    isLikedByCurrentUser: false,
    tags: ['太宰治', '文学'],
  }
];
