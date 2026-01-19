export const mockData = {
  posts: [
    {
      id: "1",
      content: "人間は考える葦である",
      book: {
        title: "パンセ",
        author: "ブレーズ・パスカル",
        coverUrl: "https://placehold.co/100x150",
      },
      user: {
        name: "哲学好き",
        avatarUrl: "https://placehold.co/40x40",
      },
      likes: 12,
      comments: 2,
      createdAt: "2時間前",
    },
    {
      id: "2",
      content: "吾輩は猫である。名前はまだ無い。",
      book: {
        title: "吾輩は猫である",
        author: "夏目漱石",
        coverUrl: "https://placehold.co/100x150",
      },
      user: {
        name: "文学青年",
        avatarUrl: "https://placehold.co/40x40",
      },
      likes: 45,
      comments: 5,
      createdAt: "5時間前",
    },
    {
      id: "3",
      content: "国境の長いトンネルを抜けると雪国であった。",
      book: {
        title: "雪国",
        author: "川端康成",
        coverUrl: "https://placehold.co/100x150",
      },
      user: {
        name: "読書家A",
        avatarUrl: "https://placehold.co/40x40",
      },
      likes: 89,
      comments: 12,
      createdAt: "1日前",
    },
  ],
  trends: [
    { id: "1", tag: "#人生" },
    { id: "2", tag: "#ミステリー" },
    { id: "3", tag: "#恋愛" },
    { id: "4", tag: "#哲学" },
    { id: "5", tag: "#ビジネス" },
  ],
  recommendedBooks: [
    { id: "1", title: "星の王子さま", coverUrl: "https://placehold.co/80x120" },
    { id: "2", title: "こころ", coverUrl: "https://placehold.co/80x120" },
    { id: "3", title: "人間失格", coverUrl: "https://placehold.co/80x120" },
  ],
};

