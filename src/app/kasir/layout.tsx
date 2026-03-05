import { KasirNav } from '@/components/kasir-nav'
import { ReactNode } from 'react'

export default function KasirLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
            <KasirNav />
            <main className="mx-auto max-w-7xl p-6">
                {children}
            </main>
        </div>
    )
}
