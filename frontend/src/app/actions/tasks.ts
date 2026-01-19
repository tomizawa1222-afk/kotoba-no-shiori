'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { TaskStatus } from '@/types'

// バリデーションスキーマ
const createTaskSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100),
  description: z.string().optional(),
  assignee_id: z.string().min(1, '担当者は必須です'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '正しい日付形式で入力してください'),
  team_id: z.string().uuid(),
})

const updateTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(['todo', 'doing', 'done']),
})

export async function createTask(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      assignee_id: formData.get('assignee_id'),
      due_date: formData.get('due_date'),
      team_id: formData.get('team_id'),
    }

    const validated = createTaskSchema.parse(rawData)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: validated.title,
        description: validated.description,
        assignee_id: validated.assignee_id,
        due_date: validated.due_date,
        team_id: validated.team_id,
        status: 'todo',
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (error) {
    console.error('Create task error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'タスクの作成に失敗しました' 
    }
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const supabase = await createClient()
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Update status error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ステータスの更新に失敗しました' 
    }
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('認証が必要です')

    const supabase = await createClient()
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Delete task error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'タスクの削除に失敗しました' 
    }
  }
}

