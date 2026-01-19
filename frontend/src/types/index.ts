export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Book {
  isbn: string;
  title: string;
  author: string;
  coverUrl?: string;
  publisher?: string;
}

export interface Quote {
  id: string;
  content: string;
  pageNumber?: number;
  privacy: 'public' | 'followers' | 'private';
  createdAt: string; // ISO String
  user: User;
  book: Book;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  tags?: string[];
}

export interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment';
  user: User;
  quote?: Quote;
  createdAt: string;
  read: boolean;
}
