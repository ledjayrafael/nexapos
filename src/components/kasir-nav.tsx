import Link from 'next/link'
import { Button } from './ui/button'

export function KasirNav() {
    return (
        <nav className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
            <div className="flex items-center gap-6">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">NexaPOS Kasir</span>
                <Link href="/kasir/pos" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Point of Sale</Link>
                <Link href="/kasir/products" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Products</Link>
                <Link href="/kasir/transactions" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Transactions</Link>
            </div>
            <div>
                <form action="/auth/signout" method="post">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">Sign Out</Button>
                </form>
            </div>
        </nav>
    )
}
