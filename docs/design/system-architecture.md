# システムアーキテクチャ設計書

## 1. 技術スタック選定

本プロジェクトでは、開発効率、パフォーマンス、拡張性、および開発者体験を最大化するため、以下のモダンな技術スタックを採用します。

| カテゴリ | 技術 | 選定理由 |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | Reactのエコシステムを活用しつつ、Server Componentsによるパフォーマンス最適化とSEO対策が容易であるため。PWA対応も強力。 |
| **Language** | **TypeScript** | 静的型付けによる堅牢なコードベースの維持と、開発時の自動補完などによる生産性向上のため。 |
| **Styling** | **Tailwind CSS** | ユーティリティファーストなCSSフレームワークであり、デザインシステムの一貫性を保ちながら迅速なUI構築が可能なため。 |
| **Backend / DB** | **Supabase** | PostgreSQLをベースとしたBaaSであり、データベース、認証、ストレージ、リアルタイム機能を一括で提供し、バックエンド開発工数を大幅に削減できるため。 |
| **Auth** | **Clerk** | 認証に特化したサービスであり、Next.jsとの親和性が非常に高く、モダンでセキュアな認証フロー（ソーシャルログイン含む）を即座に実装できるため。 |
| **Infrastructure** | **Vercel** | Next.jsの開発元が提供するホスティングプラットフォームであり、設定不要で最適化されたデプロイ環境とCI/CDパイプラインを利用できるため。 |
| **State Management** | **React Context / Zustand** | グローバルなUI状態（モーダル、トースト等）の管理には、軽量でボイラープレートの少ないZustandを採用。 |
| **Data Fetching** | **Server Actions / SWR** | Server Componentsでのデータ取得を基本とし、クライアントサイドでの再検証やリアルタイム更新が必要な箇所にはSWRまたはTanStack Queryを検討。 |

## 2. アーキテクチャ概要

システム全体は、クライアントサイド（PWA）、エッジ/サーバーレス環境（Vercel）、およびマネージドサービス（Supabase, Clerk, Google Books API）から構成されます。

```mermaid
graph TD
    Client[Client Browser (PWA)]
    
    subgraph Vercel [Vercel Platform]
        NextApp[Next.js App Router]
        ServerActions[Server Actions / API Routes]
        EdgeMiddleware[Middleware (Auth/Routing)]
    end
    
    subgraph ExternalServices [External Services]
        Clerk[Clerk Auth Service]
        Google[Google Books API]
    end
    
    subgraph SupabaseCluster [Supabase Project]
        Postgres[(PostgreSQL DB)]
        Realtime[Realtime Service]
        Storage[Storage Service]
    end
    
    %% Flows
    Client -->|HTTPS / Page Load| NextApp
    Client -->|User Interaction| ServerActions
    
    %% Auth Flow
    Client -.->|Auth SDK| Clerk
    EdgeMiddleware -->|Verify Session| Clerk
    
    %% Data Flow
    NextApp -->|Query/Mutation| Postgres
    ServerActions -->|Query/Mutation| Postgres
    ServerActions -->|Fetch Book Data| Google
    
    %% Realtime
    Client -.->|WebSocket Subscribe| Realtime
    Postgres -->|CDC Event| Realtime
    Realtime -.->|Push Update| Client
```

### コンポーネントの役割
- **Next.js App Router**: アプリケーションのコアロジック。Server Componentsを利用して初期表示のHTMLを生成し、Core Web Vitalsを最適化します。
- **Middleware**: リクエストごとの認証チェックやリダイレクト処理をエッジで実行します。
- **Server Actions**: フォーム送信やデータ更新処理をサーバーサイド関数として定義し、APIエンドポイントを明示的に作成する手間を省きます。
- **Supabase**: 永続データの保存（PostgreSQL）、画像ファイルの保存（Storage）、およびリアルタイム更新通知（Realtime）を担当します。
- **Clerk**: ユーザー認証、セッション管理、ユーザープロファイル管理を担当します。

## 3. コンポーネント設計

Next.js App Routerの設計思想に基づき、Server ComponentsとClient Componentsを適切に分離します。

### 3.1 コンポーネント階層図

```mermaid
graph TD
    RootLayout[RootLayout (Server)]
    RootLayout --> AuthProvider[ClerkProvider (Client)]
    
    AuthProvider --> Header[Header (Client)]
    AuthProvider --> Main[Main Content Area]
    AuthProvider --> Footer[Footer (Server)]
    AuthProvider --> Toaster[Toaster (Client)]
    
    subgraph "Timeline Page (/home)"
        Main --> TimelinePage[Page (Server)]
        TimelinePage --> FeedContainer[FeedContainer (Server)]
        FeedContainer --> PostList[PostList (Client)]
        PostList --> PostCard[PostCard (Server/Client)]
        PostCard --> LikeButton[LikeButton (Client)]
    end
    
    subgraph "Post Modal"
        Main -.-> PostModal[PostModal (Client)]
        PostModal --> BookSearchForm[BookSearchForm (Client)]
    end
```

### 3.2 主要コンポーネント定義

#### 1. `PostCard`
- **役割**: 引用投稿1件分を表示するカードコンポーネント。
- **Type**: Server Component (基本表示) + Client Component (インタラクション部分)
- **Props**:
  ```typescript
  interface PostCardProps {
    post: {
      id: string;
      content: string;
      book: {
        title: string;
        author: string;
        coverUrl: string;
      };
      user: {
        username: string;
        avatarUrl: string;
      };
      likesCount: number;
      isLikedByCurrentUser: boolean;
      createdAt: Date;
    };
  }
  ```

#### 2. `FeedList`
- **役割**: タイムラインの無限スクロール制御とリスト表示を担当。
- **Type**: Client Component
- **State**:
  - `posts`: 表示中の投稿リスト
  - `page`: 現在のページ番号
  - `isLoading`: 読み込み中フラグ
- **Dependencies**: `useInView` (Intersection Observer) を使用して追加読み込みをトリガー。

#### 3. `LikeButton`
- **役割**: いいねボタンの表示とトグル処理。Optimistic UI（楽観的UI）を実装。
- **Type**: Client Component
- **Props**:
  ```typescript
  interface LikeButtonProps {
    postId: string;
    initialIsLiked: boolean;
    initialCount: number;
  }
  ```
- **Behavior**: クリック時に即座にUIを更新（いいね状態/カウント）し、バックグラウンドでServer Actionを実行。失敗時にロールバック。

#### 4. `BookSearchForm`
- **役割**: 投稿モーダル内での書籍検索フォーム。
- **Type**: Client Component
- **State**: `searchQuery`, `searchResults`, `selectedBook`
- **Behavior**: 入力に対してDebounce（遅延）処理を行い、API経由でGoogle Booksを検索。

## 4. ディレクトリ構造 (案)

```
src/
├── app/                 # App Router Pages
│   ├── (auth)/          # Authentication Routes
│   ├── (main)/          # Main Application Routes
│   │   ├── home/        # Timeline
│   │   ├── search/      # Search
│   │   ├── profile/     # User Profile
│   │   └── layout.tsx   # Main Layout
│   ├── api/             # API Routes (if needed)
│   ├── layout.tsx       # Root Layout
│   └── page.tsx         # Landing Page
├── components/
│   ├── ui/              # Generic UI Components (Button, Input, etc.)
│   ├── feature/         # Feature-specific Components
│   │   ├── timeline/
│   │   ├── post/
│   │   └── book/
│   └── layout/          # Header, Footer, Sidebar
├── lib/
│   ├── supabase/        # Supabase Client setup
│   ├── actions/         # Server Actions
│   └── utils.ts         # Utility functions
├── types/               # TypeScript definitions
└── styles/              # Global styles
```

