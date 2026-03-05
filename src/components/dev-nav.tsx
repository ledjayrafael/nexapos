import Link from 'next/link'
import { Button } from './ui/button'

export function DevNav() {
    return (
        <nav className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
            <div className="flex items-center gap-6">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">NexaDev</span>
                <Link href="/developer" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/developer/users" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cashiers</Link>
            </div>
            <div>
                <form action="/auth/signout" method="post">
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">Sign Out</Button>
                </form>
            </div>
        </nav>
    )
}
