import { Post, User, Book } from '@/app/types';

const mockUser: User = {
  id: 'user1',
  name: '読書 太郎',
  avatarUrl: 'https://i.pravatar.cc/150?u=user1',
};

const mockBooks: Book[] = [
  {
    isbn: '9784101010013',
    title: '人間失格',
    author: '太宰 治',
    coverUrl: 'https://placehold.co/128x182?text=Book1',
  },
  {
    isbn: '9784062763866',
    title: 'ノルウェイの森',
    author: '村上 春樹',
    coverUrl: 'https://placehold.co/128x182?text=Book2',
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post1',
    content: '恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。',
    user: mockUser,
    book: mockBooks[0],
    likes: 124,
    comments: 12,
    createdAt: '2時間前',
    isLiked: false,
  },
  {
    id: 'post2',
    content: '死は生の対極としてではなく、その一部として存在している。',
    user: { ...mockUser, id: 'user2', name: '読書 花子', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
    book: mockBooks[1],
    likes: 89,
    comments: 5,
    createdAt: '5時間前',
    isLiked: true,
  },
];
