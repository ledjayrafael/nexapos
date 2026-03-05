import { DevNav } from '@/components/dev-nav'
import { ReactNode } from 'react'

export default function DeveloperLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
            <DevNav />
            <main className="mx-auto max-w-6xl p-6">
                {children}
            </main>
        </div>
    )
}
