// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/auth' || pathname === '/'
  const isThankYouPage = pathname === '/thank-you'
  const isFormPage = pathname === '/form'

  if (!session) {
    // UNAUTHENTICATED USERS
    if (isAuthPage || isThankYouPage) {
      return response
    }

    return NextResponse.redirect(new URL('/auth', request.url))
  } else {
    // AUTHENTICATED USERS
    if (!isFormPage) {
      return NextResponse.redirect(new URL('/form', request.url))
    }

    return response
  }
}

export const config = {
  matcher: ['/', '/auth', '/form', '/thank-you', '/((?!_next/static|_next/image|favicon.ico).*)'],
}