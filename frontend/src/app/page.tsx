import { BoardContainer } from "@/components/board/BoardContainer";
import { ensureSupabaseUser } from "@/lib/auth/sync";
import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // ユーザー同期・取得
  const user = await ensureSupabaseUser();
  if (!user) {
    // 同期エラー等の場合
    return <div>ユーザー情報の同期に失敗しました。</div>;
  }

  // 所属チームの取得（簡易的に最初のチームを取得、なければ作成）
  const supabase = await createClient();
  
  // 自分がメンバーのチームを取得
  const { data: teams } = await supabase
    .from('teams')
    .select('*, team_members!inner(user_id)')
    .eq('team_members.user_id', user.id)
    .limit(1);

  let currentTeamId = teams?.[0]?.id;

  // チームがない場合はデフォルトチームを作成
  if (!currentTeamId) {
    const { data: newTeam } = await supabase
      .from('teams')
      .insert({ name: `${user.display_name}のチーム` })
      .select()
      .single();
    
    if (newTeam) {
      currentTeamId = newTeam.id;
      // メンバー追加
      await supabase.from('team_members').insert({
        team_id: newTeam.id,
        user_id: user.id,
        role: 'admin'
      });
    }
  }

  if (!currentTeamId) {
    return <div>チームの作成に失敗しました。</div>;
  }

  // タスク取得
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('team_id', currentTeamId)
    .order('created_at', { ascending: false });

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">タスク一覧</h1>
        {/* ボタンはBoardContainer内に移動 */}
      </div>
      
      <div className="flex-1 min-h-0">
        <BoardContainer 
          initialTasks={tasks || []} 
          teamId={currentTeamId}
        />
      </div>
    </div>
  );
}
