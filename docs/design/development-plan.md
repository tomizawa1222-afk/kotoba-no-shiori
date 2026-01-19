# 開発計画書

## 1. 開発ロードマップ

詳細要件定義書に基づき、以下のフェーズに分けて開発を進めます。

### Phase 1: MVP (Minimum Viable Product)
- **期間目安**: 1.5ヶ月 〜 2ヶ月
- **ゴール**: 「言葉を記録し、共有する」というコア体験が検証可能な状態でリリースすること。
- **対象機能**:
    - ユーザー認証 (Clerk)
    - 引用投稿機能 (テキスト入力 + 書籍検索)
    - タイムライン表示 (新着/フォロー)
    - 基本的なプロフィール画面
    - 簡易検索機能

### Phase 2: 機能拡張 & リテンション強化
- **期間目安**: MVPリリース後 + 2ヶ月
- **ゴール**: ユーザーの継続率を高め、アプリとしての魅力を向上させる。
- **対象機能**:
    - 本棚機能 (読書ステータス管理)
    - 通知機能
    - 画像添付 (OCR検討)
    - トレンド表示 / おすすめアルゴリズム強化
    - PWAインストール促進

### Phase 3: コミュニティ化 & 収益化準備
- **期間目安**: Phase 2完了後 〜
- **ゴール**: ユーザー間の交流を活性化し、収益化の土台を作る。
- **対象機能**:
    - コメント / メンション
    - グループ機能
    - アフィリエイト連携

## 2. タスク分解 (WBS: Phase 1 MVP)

### 2.1 環境構築 & 基盤実装 (Week 1)
- [ ] **プロジェクトセットアップ**
    - Next.js (App Router) + TypeScript + Tailwind CSS の初期化
    - Linter / Formatter (ESLint, Prettier) の設定
    - GitHub リポジトリ作成 & Vercel連携
- [ ] **認証基盤 (Clerk)**
    - Clerk プロジェクト作成
    - Next.js への SDK 導入 & Middleware 設定
    - ログイン / 登録画面の実装
- [ ] **データベース基盤 (Supabase)**
    - Supabase プロジェクト作成
    - Migration ファイル作成 (Initial Schema)
    - TypeScript 型定義の生成 (`supabase gen types`)

### 2.2 データベース & API実装 (Week 2)
- [ ] **DBスキーマ適用**
    - `users`, `books`, `quotes`, `likes` テーブル作成
    - RLS (Row Level Security) ポリシーの適用
- [ ] **Server Actions 実装**
    - `actions/post.ts`: 投稿作成処理
    - `actions/user.ts`: プロフィール更新処理
    - `actions/book.ts`: 書籍情報取得・保存処理
- [ ] **API Routes 実装**
    - `api/books/search`: Google Books API ラッパー
    - `api/timeline`: タイムライン取得用エンドポイント

### 2.3 フロントエンド実装: 共通 & 投稿 (Week 3-4)
- [ ] **UIコンポーネント作成**
    - Button, Input, Modal, Card などの基本コンポーネント (Atomic Design意識)
    - デザインシステム (Color, Typography) の適用
- [ ] **レイアウト実装**
    - ヘッダー, フッターナビゲーション (Bottom Tab)
    - 認証状態による表示切り替え
- [ ] **投稿機能実装**
    - 投稿モーダル画面
    - 書籍検索モーダル & 選択ロジック
    - 投稿完了時のトースト通知 & キャッシュ更新

### 2.4 フロントエンド実装: 閲覧 & プロフィール (Week 5-6)
- [ ] **タイムライン実装**
    - `FeedContainer` (Server Component) 実装
    - 無限スクロール (`useInView`) 実装
    - `PostCard` & いいね機能 (Optimistic UI)
- [ ] **詳細画面実装**
    - 投稿詳細ページ
    - ユーザープロフィールページ
    - 書籍詳細ページ（関連投稿一覧）
- [ ] **検索画面実装**
    - キーワード検索フォーム
    - 結果表示リスト

### 2.5 テスト & デプロイ (Week 7)
- [ ] **QAテスト**
    - 主要ユースケースの動作確認
    - レスポンシブ表示確認 (SP/PC)
    - エラーハンドリング確認
- [ ] **本番環境設定**
    - Vercel Environment Variables 設定
    - Supabase Production 環境構築
    - Clerk Production 環境設定
- [ ] **リリース**

## 3. リスク管理

| リスク項目 | 確率 | 影響度 | 対策 |
| :--- | :--- | :--- | :--- |
| **著作権侵害リスク** | 高 | 高 | ・投稿画面での注意喚起文言の表示<br>・引用文字数の制限 (最大500文字)<br>・通報機能の優先実装 |
| **APIレート制限 (Google Books)** | 中 | 中 | ・検索結果のサーバーサイドキャッシュ (Next.js Cache)<br>・クライアント側でのDebounce処理 (入力遅延) |
| **開発スケジュールの遅延** | 中 | 高 | ・機能をMoSCoW分析で厳密に優先度付けし、Should/Could機能はPhase 2へ回す。<br>・Supabase/Clerk等のBaaSを最大限活用し、独自実装を減らす。 |
| **モバイルパフォーマンス低下** | 低 | 中 | ・画像の最適化 (`next/image`)<br>・Server Componentsの積極利用によるバンドルサイズ削減<br>・Lighthouseによる定期的なスコア計測 |

## 4. 開発体制 & ツール

- **リポジトリ管理**: GitHub
- **タスク管理**: GitHub Projects (カンバン方式)
- **CI/CD**: Vercel (自動デプロイ)
- **コミュニケーション**: Slack / Discord
- **デザイン**: Figma (必要に応じて詳細化)

