'use client'

import { useTransition, useState } from 'react'
import { createTask } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'
import { Task } from '@/types'
import { Button } from '@/components/ui/Button'
import { mockUsers } from '@/lib/mock-data' // 実際はDBからユーザー取得すべきだが、今回はMockかContextから取得

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  teamId: string
}

export function TaskModal({ isOpen, onClose, teamId }: TaskModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    // team_id を追加
    formData.append('team_id', teamId)

    startTransition(async () => {
      const result = await createTask(formData)

      if (result.success) {
        onClose()
        router.refresh()
      } else {
        setError(result.error || '作成に失敗しました')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg border border-border p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">タスク作成</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">タイトル</label>
            <input
              name="title"
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">期限</label>
            <input
              name="due_date"
              type="date"
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">担当者</label>
            <select
              name="assignee_id"
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isPending}
            >
              <option value="">選択してください</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>{user.display_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">詳細 (任意)</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

