import { createClient } from '@/utils/supabase/server'
import { ProductForm } from './product-form'
import { deleteProduct } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'

export default async function ProductsPage() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Products Menu</h1>
                <p className="text-zinc-400">Manage products, pricing, and stock.</p>
                <ProductForm />
            </div>

            <Card className="bg-zinc-900 border-zinc-800 h-fit">
                <CardHeader>
                    <CardTitle className="text-zinc-100">Product List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="w-[80px] text-zinc-400">Image</TableHead>
                                <TableHead className="text-zinc-400">Name</TableHead>
                                <TableHead className="text-zinc-400">Price</TableHead>
                                <TableHead className="text-zinc-400">Stock</TableHead>
                                <TableHead className="text-right text-zinc-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((product) => (
                                <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell>
                                        {product.image_url ? (
                                            <div className="relative h-10 w-10 overflow-hidden rounded-md border border-zinc-800">
                                                {/* We use unoptimized img or next/image if configured */}
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                                <span className="text-xs text-zinc-500">No Img</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-zinc-200">{product.name}</TableCell>
                                    <TableCell className="text-zinc-300">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : product.stock > 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}`}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <form action={deleteProduct}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <Button variant="destructive" size="sm" type="submit" className="bg-red-900/50 text-red-400 hover:bg-red-900/80 hover:text-red-300 border border-red-900/50">
                                                Delete
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!products || products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                        No products found. Add some to start selling.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
