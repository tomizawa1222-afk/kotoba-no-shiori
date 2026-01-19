# Supabase + Clerk 統合設定ガイド

本プロジェクトでは、認証に **Clerk**、バックエンド/DBに **Supabase** を使用しています。
ローカル開発を開始するために、以下の手順に従って設定を行ってください。

## 1. Clerk の設定

1. [Clerk Dashboard](https://dashboard.clerk.com/) にアクセスし、新しいプロジェクトを作成します。
2. **API Keys** を取得します。
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. `.env.local` ファイル（`frontend` ディレクトリ内）を作成し、値を設定します（後述）。

## 2. Supabase の設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセスし、新しいプロジェクトを作成します。
2. **Project Settings > API** からキーを取得します。
   - Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `service_role` secret -> `SUPABASE_SERVICE_ROLE_KEY` (⚠️ 取り扱い注意)

## 3. 環境変数の設定

`frontend` ディレクトリ直下に `.env.local` ファイルを作成し、以下の内容を記述してください。

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 4. データベースのセットアップ（マイグレーション）

SupabaseのSQLエディタを使用して、テーブルを作成します。

1. Supabase Dashboard の **SQL Editor** を開きます。
2. プロジェクト内の `frontend/supabase/migrations/20260117000000_initial_schema.sql` の中身をコピーします。
3. SQL Editor に貼り付けて **Run** をクリックします。
   - これにより、`users`, `teams`, `tasks` テーブルとRLSポリシーが作成されます。

## 5. 動作確認

```bash
cd frontend
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスし、右上の「ログイン」ボタンからClerk経由でログインできることを確認してください。
ログイン後、Supabaseの `users` テーブルに自分のレコードが作成されていれば同期成功です。

