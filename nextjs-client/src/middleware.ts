import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
    const { url, cookies } = request
    const session = cookies.get('session')?.value
    const { pathname } = request.nextUrl

    const isAuthPage = pathname.startsWith('/auth')
    const isAdminPage = pathname.startsWith('/admin')
    const isDashboardPage = pathname.startsWith('/dashboard')

    // 1. Если пользователь на страницах логина/регистрации
    if (isAuthPage) {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard/settings', url))
        }
        return NextResponse.next()
    }

    // 2. Если сессии нет, а пользователь ломится в защищенные разделы
    if (!session && (isAdminPage || isDashboardPage)) {
        return NextResponse.redirect(new URL('/auth/login', url))
    }

    // 3. Важный момент: Роль ADMIN
    // В идеале роль должна быть в JWT или зашифрованной куке.
    // Если она там есть, мы могли бы ее проверить здесь.
    // Но пока мы просто добавим путь в matcher, чтобы аноним точно не зашел.

    return NextResponse.next()
}

export const config = {
    // Добавляем /admin/:path* сюда!
    matcher: ['/auth/:path*', '/dashboard/:path*', '/admin/:path*', '/voting']
}
