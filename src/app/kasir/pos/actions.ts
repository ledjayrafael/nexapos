'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkout(cart: { id: string, name: string, price: number, quantity: number }[], total_price: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase.from('profiles').select('store_id').eq('id', user.id).single()

    if (!profile) return { error: 'Profile not found' }

    // 1. Create transaction
    const { data: tx, error: txError } = await supabase.from('transactions').insert({
        store_id: profile.store_id,
        cashier_id: user.id,
        total_price
    }).select().single()

    if (txError) {
        console.error('Transaction creation error:', txError)
        return { error: 'Failed to create transaction' }
    }

    // 2. Create order_items
    const orderItems = cart.map(item => ({
        transaction_id: tx.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
        console.error('Order items error:', itemsError)
        return { error: 'Transaction succeeded but failed to record items (stock may be inaccurate)' }
    }

    revalidatePath('/kasir/pos')
    revalidatePath('/kasir/products')
    revalidatePath('/kasir/transactions')

    return { success: true, transactionId: tx.id }
}
