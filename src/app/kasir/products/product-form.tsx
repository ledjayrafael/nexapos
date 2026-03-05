'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { addProduct } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProductForm() {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const price = Number(formData.get('price'))
        const stock = Number(formData.get('stock'))

        try {
            let image_url = ''

            if (file) {
                const supabase = createClient()
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `public/${fileName}`

                const { error: uploadError, data } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                image_url = publicUrl
            }

            const res = await addProduct({ name, price, stock, image_url })
            if ('error' in res && res.error) throw new Error(res.error as string)

            toast.success('Product added successfully!')
            // Reset form
            e.currentTarget.reset()
            setFile(null)
        } catch (error: any) {
            toast.error(error.message || 'Failed to add product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-zinc-100">Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-200">Product Name</Label>
                        <Input id="name" name="name" required className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-zinc-200">Price (IDR)</Label>
                            <Input id="price" name="price" type="number" min="0" required className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock" className="text-zinc-200">Initial Stock</Label>
                            <Input id="stock" name="stock" type="number" min="0" required className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-zinc-200">Product Image (Optional)</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 file:text-zinc-200"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
