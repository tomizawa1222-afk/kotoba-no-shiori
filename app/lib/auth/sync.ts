import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceRoleClient } from '@/app/lib/supabase/service-role'

export async function ensureSupabaseUser() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  const supabase = createServiceRoleClient()
  
  // Upsert user data to Supabase
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: userId, // Use Clerk ID directly as PK
        username: user.username || `user_${userId.substring(0, 8)}`,
        display_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'No Name',
        avatar_url: user.imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error syncing user to Supabase:', error)
    // Don't throw error to prevent blocking the UI, but log it
    return null
  }
  
  return data
}

