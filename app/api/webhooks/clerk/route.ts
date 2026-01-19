import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createServiceRoleClient } from '@/app/lib/supabase/service-role'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type
  const supabase = createServiceRoleClient()

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, username, first_name, last_name, image_url, email_addresses } = evt.data

    const displayName = first_name && last_name 
      ? `${first_name} ${last_name}`
      : first_name || username || '名無しさん'
    
    // emailのローカルパートをusernameの代替とする (usernameが必須だがClerkで設定されていない場合用)
    const emailUsername = email_addresses[0]?.email_address?.split('@')[0]
    const finalUsername = username || emailUsername || id

    const { error } = await supabase
      .from('users')
      .upsert({
        id: id,
        username: finalUsername,
        display_name: displayName,
        avatar_url: image_url,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error upserting user to Supabase:', error)
      return new Response('Error inserting user data', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    
    if (id) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting user from Supabase:', error)
        return new Response('Error deleting user data', { status: 500 })
      }
    }
  }

  return new Response('', { status: 200 })
}

