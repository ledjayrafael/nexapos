'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// This requires SUPERADMIN/SERVICE_ROLE key configured in .env.local
function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

export async function addCashier(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        console.error('Email and password are required')
        return
    }

    // 1. Get developer's store_id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.error('Not authenticated')
        return
    }

    const { data: profile } = await supabase.from('profiles').select('store_id, role').eq('id', user.id).single()

    if (profile?.role !== 'developer') {
        console.error('Unauthorized to create cashiers')
        return
    }

    const adminClient = getAdminClient()

    // 2. Create Auth User
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    })

    if (authError) {
        console.error('Error creating auth user:', authError)
        return
    }

    // 3. Insert into Profiles as Cashier
    const { error: profileError } = await adminClient.from('profiles').insert({
        id: authData.user.id,
        store_id: profile.store_id,
        role: 'cashier',
        email: authData.user.email
    })

    if (profileError) {
        console.error('Error inserting profile:', profileError)
        // Rollback user creation
        await adminClient.auth.admin.deleteUser(authData.user.id)
        return
    }

    revalidatePath('/developer/users')
}

export async function deleteCashier(formData: FormData) {
    const supabase = await createClient()
    const userId = formData.get('user_id') as string

    if (!userId) {
        console.error('User ID is required')
        return
    }

    // 1. Validate Developer access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.error('Not authenticated')
        return
    }

    const { data: devProfile } = await supabase.from('profiles').select('store_id, role').eq('id', user.id).single()

    if (devProfile?.role !== 'developer') {
        console.error('Unauthorized')
        return
    }

    // 2. Verify target user is a cashier in the same store
    const { data: targetProfile } = await supabase.from('profiles').select('store_id, role').eq('id', userId).single()

    if (targetProfile?.store_id !== devProfile.store_id || targetProfile?.role !== 'cashier') {
        console.error('Cannot delete this user')
        return
    }

    const adminClient = getAdminClient()

    // 3. Delete Auth User (cascades to profiles)
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) {
        console.error('Failed to delete user', error)
        return
    }

    revalidatePath('/developer/users')
}
