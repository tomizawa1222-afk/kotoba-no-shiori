# API仕様書

## 1. 設計方針
本アプリケーションでは、Next.js App Routerの **Server Actions** を主要な通信手段として採用します。そのため、従来のREST APIエンドポイントは原則として公開せず、クライアントコンポーネントから直接サーバー側の関数（Server Actions）を呼び出すRPC（Remote Procedure Call）形式となります。

*   **プロトコル**: HTTPS
*   **データ形式**: JSON (Server Actionsのシリアライゼーション)
*   **認証**: Clerkにより管理されるセッションCookie。Server Action内で `auth()` ヘルパーを使用して検証します。

## 2. Server Actions 一覧

以下は、クライアントから呼び出される主要なServer Actionsの定義です。

### 2.1. タスク関連

#### `createTask(data: CreateTaskInput): Promise<Task>`
*   **概要**: 新しいタスクを作成する。
*   **権限**: ログイン済みかつ、対象チームのメンバーであること。
*   **引数**:
    ```typescript
    type CreateTaskInput = {
      teamId: string;
      title: string;
      description?: string;
      assigneeId: string;
      dueDate: Date;
    };
    ```
*   **処理**:
    1.  入力バリデーション（Zodなどを使用）。
    2.  権限チェック。
    3.  DBへのINSERT実行。
    4.  成功時、作成されたタスクオブジェクトを返す。失敗時、エラーをスロー。

#### `updateTaskStatus(taskId: string, status: TaskStatus): Promise<void>`
*   **概要**: タスクのステータスを変更する（ドラッグ＆ドロップ時など）。
*   **権限**: 同上。
*   **引数**:
    *   `taskId`: 更新対象のタスクID
    *   `status`: 'todo' | 'doing' | 'done'
*   **処理**: 指定されたIDのタスクのステータスを更新する。

#### `deleteTask(taskId: string): Promise<void>`
*   **概要**: タスクを削除する。
*   **権限**: 同上。

### 2.2. チーム関連

#### `createTeam(name: string): Promise<Team>`
*   **概要**: 新しいチームを作成し、作成者を管理者として追加する。

#### `inviteMember(teamId: string, email: string): Promise<void>`
*   **概要**: 指定したメールアドレスのユーザーをチームに招待する。
    *   ※簡易実装として、既存ユーザーであれば即時追加、未登録であれば招待レコードを作成するなどのフローを想定。

## 3. リアルタイム通信仕様 (Supabase Realtime)

*   **チャンネル名**: `tasks:team_id=UUID`
*   **イベント**: Postgresの変更イベント（INSERT, UPDATE, DELETE）をそのまま購読。
*   **ペイロード**:
    *   変更された行（`new`）および削除された行（`old`）の全カラムデータが含まれる。
*   **クライアント処理**: 受信したイベントに基づき、ローカルのタスクリストStateを更新する。

