import { Task } from "@/types";
import { mockUsers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Calendar, User as UserIcon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  // ユーザー情報は本来ContextやPropで渡すべきだが、簡易的にMockから検索
  // 実装が進めば useSupabaseUser フックなどで解決する
  const assignee = mockUsers.find((u) => u.id === task.assignee_id);
  
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== "done";

  // dnd-kit draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-card text-card-foreground p-3 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group touch-none",
        isDragging && "opacity-50",
        isOverdue && "border-destructive/50 ring-1 ring-destructive/50"
      )}
    >
      <div className="mb-2 pointer-events-none">
        <h3 className="font-medium text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
          {task.title}
        </h3>
      </div>
      
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground pointer-events-none">
        <div className={cn("flex items-center gap-1", isOverdue && "text-destructive font-medium")}>
          <Calendar className="h-3 w-3" />
          <span>{task.due_date}</span>
        </div>
        
        <div className="flex items-center gap-1" title={assignee?.display_name || '担当者なし'}>
           {assignee?.avatar_url ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={assignee.avatar_url} alt={assignee.display_name || ''} className="h-5 w-5 rounded-full" />
           ) : (
             <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
               <UserIcon className="h-3 w-3" />
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
