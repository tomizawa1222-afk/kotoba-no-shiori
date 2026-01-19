export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Book = {
  isbn: string;
  title: string;
  author: string;
  coverUrl: string;
};

export type Post = {
  id: string;
  content: string;
  user: User;
  book: Book;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
};
