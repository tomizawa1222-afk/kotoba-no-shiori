# システムアーキテクチャ設計書

## 1. 技術スタック

### フロントエンド
*   **Framework**: Next.js (App Router)
    *   **理由**: パフォーマンス（Server Components）、SEO（今回はSPA的利用だがOGP等で有利）、開発体験、Vercelとの親和性。
*   **Language**: TypeScript
    *   **理由**: 型安全性、保守性、開発効率の向上。
*   **Styling**: Tailwind CSS
    *   **理由**: 開発速度、ユーティリティファーストによるスタイルの一貫性、バンドルサイズの最適化。
*   **State Management**: React Context + Hooks (Local), Supabase Realtime (Server Sync)
    *   **理由**: アプリの複雑度が低いため、Redux等の大掛かりなライブラリは不要。リアルタイム性はSupabaseに委譲。

### バックエンド / インフラ
*   **Database**: Supabase (PostgreSQL)
    *   **理由**: フルマネージド、Realtime機能、RLSによる堅牢なセキュリティ、SQLの強力な機能。
*   **Auth**: Clerk
    *   **理由**: 認証実装の工数削減、セキュリティ担保、Next.js Middlewareとの容易な連携。
*   **Hosting**: Vercel
    *   **理由**: Next.jsの最適化ホスティング、デプロイの容易さ、エッジ機能。
*   **API Communication**: Server Actions
    *   **理由**: APIルートを個別に定義するオーバーヘッドの削減、型安全なRPCライクな呼び出し。

## 2. アーキテクチャ概要

本システムは、Next.js App Routerを中心に、Vercel上で動作するフロントエンド/BFF層と、Supabaseが提供するDB/Realtime層、Clerkによる認証サービスで構成されます。

```mermaid
graph TD
    User[User Browser]
    
    subgraph Vercel
        Next[Next.js App Router]
        Auth[Clerk Middleware]
        ServerActions[Server Actions]
    end
    
    subgraph External
        ClerkAuth[Clerk Auth Service]
    end

    subgraph Supabase
        DB[(PostgreSQL)]
        Realtime[Realtime Service]
    end

    User -->|HTTPS (Page Load/Nav)| Next
    User -->|WebSocket (Live Updates)| Realtime
    Next -->|Auth Check (Middleware)| Auth
    Auth -->|Validate Session| ClerkAuth
    Next -->|Data Mutation (RPC)| ServerActions
    ServerActions -->|SQL Query| DB
    DB -->|Change Data Capture| Realtime
```

### コンポーネントの役割
*   **Next.js App Router**: アプリケーションのメインロジック、ルーティング、UIレンダリングを担当。
*   **Clerk Middleware**: 全てのリクエストに対する認証チェックとリダイレクト制御を行う。
*   **Server Actions**: クライアントからのデータ更新リクエスト（タスク作成など）を受け付け、DB操作を行う。
*   **Supabase Realtime**: DBの変更（他ユーザーによるタスク移動など）をWebSocket経由でクライアントに即時プッシュする。

## 3. コンポーネント設計

Next.js App RouterのServer/Client Componentパターンを適切に分離し、パフォーマンスとインタラクティブ性を両立させます。

### コンポーネント階層図

```mermaid
graph TD
    Layout[RootLayout (Server)]
    AuthProvider[ClerkProvider (Client)]
    
    Layout --> AuthProvider
    AuthProvider --> Header[Header (Client)]
    AuthProvider --> Main[Main Content]
    
    Main --> BoardPage[BoardPage (Server)]
    BoardPage --> BoardContainer[BoardContainer (Client)]
    
    BoardContainer --> Column[Column (Client)]
    Column --> TaskCard[TaskCard (Client)]
    TaskCard --> TaskModal[TaskModal (Client)]
    
    Header --> FocusToggle[FocusToggle (Client)]
    Header --> UserMenu[UserMenu (Client)]
```

### 主要コンポーネント定義

#### 1. `BoardContainer` (Client Component)
*   **役割**: カンバンボード全体の状態管理とリアルタイム同期のハンドリング。
*   **Props**:
    *   `initialTasks: Task[]`: サーバーサイドでフェッチした初期タスクデータ。
    *   `teamId: string`: 現在のチームID。
*   **State**:
    *   `tasks`: 現在表示中のタスクリスト。
*   **Realtime**: `useEffect` 内で `supabase.channel` を購読し、INSERT/UPDATE/DELETEイベントを受け取って `tasks` ステートを更新する。

#### 2. `TaskCard` (Client Component)
*   **役割**: 個別のタスク表示とドラッグ操作のハンドル。
*   **Props**:
    *   `task: Task`: 表示するタスクデータ。
*   **Interaction**: ドラッグ開始イベントの発火。クリック時に詳細モーダルを開くコールバックの実行。

#### 3. `FocusToggle` (Client Component)
*   **役割**: 集中モードのON/OFF切り替えとタイマー管理。
*   **State**:
    *   `isFocusMode`: boolean
    *   `timeLeft`: number (残り秒数)
*   **Logic**: ON時にGlobal State (Context) の `focusMode` フラグを更新し、画面全体のフィルタリングをトリガーする。

### Server/Clientの区分方針
*   **Server Component**:
    *   データフェッチが必要なページルート (`page.tsx`)。
    *   インタラクションを持たない静的なレイアウト部分。
    *   機密情報（APIキーなど）を扱う処理。
*   **Client Component**:
    *   `useState`, `useEffect` を使用する部分。
    *   ブラウザAPI（LocalStorage, Notification APIなど）を使用する部分。
    *   ドラッグ＆ドロップなどのDOM操作が必要な部分。

