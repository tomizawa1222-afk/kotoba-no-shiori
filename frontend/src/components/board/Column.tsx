import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export function Column({ title, status, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex flex-col h-full min-w-[300px] w-full max-w-sm rounded-xl bg-muted/50 p-2"
    >
      <div className="flex items-center justify-between p-3">
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full",
            status === 'todo' && "bg-gray-400",
            status === 'doing' && "bg-blue-500",
            status === 'done' && "bg-green-500"
          )} />
          {title}
        </h2>
        <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-1 min-h-0">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
