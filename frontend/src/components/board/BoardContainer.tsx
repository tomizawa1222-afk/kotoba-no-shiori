"use client";

import { Task, TaskStatus } from "@/types";
import { useState, useEffect } from "react";
import { Column } from "./Column";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { updateTaskStatus } from "@/app/actions/tasks";
import { createClient } from "@/lib/supabase/client";
import { TaskModal } from "./TaskModal";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface BoardContainerProps {
  initialTasks: Task[];
  teamId: string;
}

export function BoardContainer({ initialTasks, teamId }: BoardContainerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  // リアルタイム購読
  useEffect(() => {
    setTasks(initialTasks); // Props更新時にStateも更新

    const channel = supabase
      .channel(`tasks:team_id=${teamId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `team_id=eq.${teamId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => [...prev, payload.new as Task]);
        } else if (payload.eventType === 'UPDATE') {
          setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new as Task : t));
        } else if (payload.eventType === 'DELETE') {
          setTasks(prev => prev.filter(t => t.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [initialTasks, teamId, supabase]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px移動したらドラッグ開始（クリックとの誤爆防止）
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    // ColumnのIDはStatusになっている
    const newStatus = over.id as TaskStatus; 

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // 楽観的UI更新
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    // サーバー更新
    const result = await updateTaskStatus(taskId, newStatus);
    if (!result.success) {
      // 失敗したら戻す（リロードなどで対応）
      console.error('Failed to update status');
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doingTasks = tasks.filter((t) => t.status === "doing");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            タスク追加
          </Button>
        </div>

        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4 overflow-x-auto pb-4">
            <Column title="未着手" status="todo" tasks={todoTasks} />
            <Column title="作業中" status="doing" tasks={doingTasks} />
            <Column title="完了" status="done" tasks={doneTasks} />
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        teamId={teamId}
      />
    </>
  );
}
