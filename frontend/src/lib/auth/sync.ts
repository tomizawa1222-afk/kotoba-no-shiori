import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

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
        id: userId, // Use Clerk ID as PK
        email: user.emailAddresses[0].emailAddress,
        display_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'No Name',
        avatar_url: user.imageUrl,
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error syncing user to Supabase:', error)
    throw error
  }
  
  return data
}

