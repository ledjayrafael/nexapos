'use client'

import { useState } from 'react'
import { checkout } from './actions'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

type Product = {
    id: string
    name: string
    price: number
    stock: number
    image_url: string | null
}

type CartItem = Product & { quantity: number }

export function POSInterface({ products }: { products: Product[] }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [paymentAmount, setPaymentAmount] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                if (existing.quantity >= product.stock) {
                    toast.error('Not enough stock')
                    return prev
                }
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const updateQuantity = (id: string, delta: number) => {
        setCart((prev) => prev.map(item => {
            if (item.id === id) {
                const newQ = item.quantity + delta
                if (newQ > item.stock) {
                    toast.error('Exceeds available stock')
                    return item
                }
                return { ...item, quantity: newQ }
            }
            return item
        }).filter(item => item.quantity > 0))
    }

    const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const payment = Number(paymentAmount) || 0
    const change = payment > grandTotal ? payment - grandTotal : 0

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error('Cart is empty')
        if (payment < grandTotal) return toast.error('Insufficient payment')

        setLoading(true)
        try {
            const res = await checkout(
                cart.map(c => ({ id: c.id, name: c.name, price: c.price, quantity: c.quantity })),
                grandTotal
            )

            if ('error' in res && res.error) throw new Error(res.error)

            toast.success('Transaction Successful! Change: IDR ' + change.toLocaleString())
            setCart([])
            setPaymentAmount('')
        } catch (err: any) {
            toast.error(err.message || 'Checkout failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr] h-[calc(100vh-8rem)]">
            {/* Product Grid */}
            <Card className="bg-zinc-900 border-zinc-800 flex flex-col overflow-hidden">
                <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
                    <CardTitle className="text-zinc-100">Products</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => product.stock > 0 ? addToCart(product) : toast.error('Out of stock')}
                                className={`group cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700 hover:bg-zinc-900 transition-all ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="aspect-square w-full relative mb-3 overflow-hidden rounded-md bg-zinc-800 border border-zinc-800">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">No Img</div>
                                    )}
                                </div>
                                <h3 className="font-medium text-zinc-200 truncate">{product.name}</h3>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-emerald-400 font-semibold">{product.price.toLocaleString('id-ID')}</p>
                                    <span className="text-xs text-zinc-500">{product.stock} in stock</span>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full h-32 flex items-center justify-center text-zinc-500">
                                No products available in this store.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* Cart Sidebar */}
            <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-full overflow-hidden">
                <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
                    <CardTitle className="text-zinc-100">Current Order</CardTitle>
                </CardHeader>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-start border-b border-zinc-800 pb-4">
                                <div className="space-y-1 overflow-hidden">
                                    <p className="font-medium text-zinc-200 truncate">{item.name}</p>
                                    <p className="text-sm text-zinc-400">@ {item.price.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center rounded-md border border-zinc-700 bg-zinc-800">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-zinc-400 hover:text-white">-</button>
                                        <span className="w-6 text-center text-sm font-medium text-white">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-zinc-400 hover:text-white">+</button>
                                    </div>
                                    <p className="w-20 text-right font-semibold text-emerald-400 shrink-0">
                                        {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <div className="h-32 flex items-center justify-center text-zinc-500">
                                Cart is empty
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="border-t border-zinc-800 p-4 space-y-4 bg-zinc-950/50">
                    <div className="flex justify-between items-center text-lg font-bold text-zinc-100">
                        <span>Total</span>
                        <span className="text-emerald-400">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="payment" className="text-zinc-300">Payment Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">Rp</span>
                                <Input
                                    id="payment"
                                    type="number"
                                    min={0}
                                    className="pl-8 bg-zinc-800 border-zinc-700 text-zinc-100"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {payment >= grandTotal && grandTotal > 0 && (
                            <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-md border border-zinc-700">
                                <span className="text-sm font-medium text-zinc-300">Change Due</span>
                                <span className="font-bold text-cyan-400">Rp {change.toLocaleString('id-ID')}</span>
                            </div>
                        )}

                        <Button
                            className="w-full h-12 text-lg font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg"
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0 || payment < grandTotal}
                        >
                            {loading ? 'Processing...' : 'Complete Transaction'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
