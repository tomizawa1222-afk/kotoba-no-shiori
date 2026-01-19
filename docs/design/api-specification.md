# API インターフェース仕様書

## 1. 設計方針

本システムでは、Next.js App Routerの **Server Actions** を主軸としたデータ操作を採用します。これにより、クライアントとサーバー間の通信を型安全に行い、明示的なREST APIエンドポイントの定義を最小限に抑えます。
ただし、外部サービス連携（Google Books API）や、検索クエリなどGETリクエストが適している処理については、一部API RouteまたはServer Component内での直接データフェッチを使用します。

### 認証・認可
- すべてのServer ActionおよびAPI Routeは、Clerkのセッション検証を経て実行されます。
- 未認証状態でのリクエストに対しては、HTTP 401 Unauthorized エラーを返却、またはログイン画面へのリダイレクトを行います。

## 2. Server Actions 一覧

これらはクライアントコンポーネントから関数として直接呼び出されます。

### 2.1 投稿関連 (`actions/post.ts`)

#### `createPost`
新規の引用投稿を作成します。
- **引数**:
  ```typescript
  {
    content: string;      // 引用本文 (必須, max: 500)
    bookIsbn: string;     // 書籍ISBN (必須)
    pageNumber?: number;  // ページ番号 (任意)
    privacy: 'public' | 'followers' | 'private'; // 公開設定
    tags?: string[];      // タグリスト
  }
  ```
- **処理**:
  1. 入力値のバリデーション（Zod等を使用）。
  2. 書籍が `books` テーブルに存在しない場合、Google Books APIから情報を取得して `books` テーブルに挿入。
  3. `quotes` テーブルにレコードを作成。
- **戻り値**:
  ```typescript
  { success: boolean; data?: Quote; error?: string }
  ```

#### `toggleLike`
投稿への「いいね」を切り替えます。
- **引数**: `postId: string`
- **処理**:
  - 既存の「いいね」があれば削除、なければ作成。
  - キャッシュの再検証 (`revalidatePath`) をトリガー。
- **戻り値**:
  ```typescript
  { success: boolean; isLiked: boolean; newCount: number }
  ```

### 2.2 ユーザー関連 (`actions/user.ts`)

#### `updateProfile`
ユーザープロフィールを更新します。
- **引数**:
  ```typescript
  {
    displayName?: string;
    bio?: string;
    avatarUrl?: string; // 事前にSupabase Storageへアップロード済みのURL
  }
  ```
- **戻り値**: `{ success: boolean; error?: string }`

### 2.3 本棚関連 (`actions/bookshelf.ts`)

#### `updateBookStatus`
書籍の読書ステータスを更新します。
- **引数**:
  ```typescript
  {
    isbn: string;
    status: 'read' | 'reading' | 'want_to_read';
  }
  ```
- **戻り値**: `{ success: boolean }`

## 3. API Routes (Next.js Route Handlers)

GETリクエストによる検索処理や、Webhook処理に使用します。

### 3.1 書籍検索

**`GET /api/books/search`**
Google Books APIのラッパーとして機能し、CORS制約の回避やレスポンスの整形を行います。

- **Query Parameters**:
  - `q`: 検索キーワード (必須)
  - `page`: ページ番号 (デフォルト: 0)
- **Response**:
  ```json
  {
    "items": [
      {
        "isbn": "9784...",
        "title": "書籍タイトル",
        "authors": ["著者名"],
        "coverUrl": "https://..."
      }
    ],
    "totalItems": 120
  }
  ```

### 3.2 タイムライン取得 (Internal Use)

**`GET /api/timeline`**
無限スクロール用の追加データ取得エンドポイント。基本的にはServer Actionsでも代用可能ですが、SWR等を利用する場合のために定義します。

- **Query Parameters**:
  - `cursor`: 前回の最後の投稿IDまたはタイムスタンプ
  - `limit`: 取得件数 (デフォルト: 20)
  - `type`: `recommended` | `following`
- **Response**:
  ```json
  {
    "data": [ ...quotes ],
    "nextCursor": "uuid-..."
  }
  ```

## 4. エラーハンドリング

APIおよびServer Actionsは、共通のエラーレスポンス形式に従います。

```typescript
type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; details?: any } };
```

- **400 Bad Request**: 入力バリデーションエラー。
- **401 Unauthorized**: 認証切れ、または未ログイン。
- **403 Forbidden**: アクセス権限のないリソースへの操作。
- **404 Not Found**: 対象のリソースが存在しない。
- **500 Internal Server Error**: サーバー内部エラー。

