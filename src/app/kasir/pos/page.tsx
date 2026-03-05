import { createClient } from '@/utils/supabase/server'
import { POSInterface } from './pos-interface'

export default async function POSPage() {
    const supabase = await createClient()

    // Fetch products (RLS securely limits to the cashier's store products)
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('name')

    return (
        <div className="h-full">
            <POSInterface products={products || []} />
        </div>
    )
}
