'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProduct(data: { name: string, price: number, stock: number, image_url: string }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase.from('profiles').select('store_id').eq('id', user.id).single()

    if (!profile) {
        console.error('Profile not found')
        return
    }

    const { error } = await supabase.from('products').insert({
        store_id: profile.store_id,
        name: data.name,
        price: data.price,
        stock: data.stock,
        image_url: data.image_url
    })

    if (error) {
        console.error('Add product error:', error)
        return { error: error.message }
    }

    revalidatePath('/kasir/products')
    revalidatePath('/kasir/pos')
    return { success: true }
}

export async function deleteProduct(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    if (!id) {
        console.error('Product ID is required')
        return
    }

    // Optionally could fetch product first to delete the image from storage,
    // but for this MVP deleting the record is sufficient.
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
        console.error('Delete product error:', error)
        return
    }

    revalidatePath('/kasir/products')
    revalidatePath('/kasir/pos')
}
