import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh the session if expired
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    // Redirect root to login
    if (path === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Handle protected routes
    if (path.startsWith('/developer') || path.startsWith('/kasir')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

        if (path.startsWith('/developer') && profile?.role !== 'developer') {
            return NextResponse.redirect(new URL('/kasir', request.url))
        }

        if (path.startsWith('/kasir') && profile?.role !== 'cashier') {
            return NextResponse.redirect(new URL('/developer', request.url))
        }
    }

    // Handle authenticated users visiting login page
    if (path.startsWith('/login') && user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'developer') {
            return NextResponse.redirect(new URL('/developer', request.url))
        } else if (profile?.role === 'cashier') {
            return NextResponse.redirect(new URL('/kasir', request.url))
        }
    }

    return supabaseResponse
}
