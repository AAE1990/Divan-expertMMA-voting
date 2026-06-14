import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 1. Создаем стандартный middleware для локализации
const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 2. Достаем токен авторизации по точному имени куки 'session'
  const token = request.cookies.get('session')?.value;

  // Регулярное выражение ловит: /auth/login, /auth/register, /auth/reset-password и /auth/new-password для любой локали
  const isAuthPage = pathname.match(/^\/(ru|en)\/auth\/(login|register|reset-password|new-password)$/) || 
                     pathname === '/auth/login' || 
                     pathname === '/auth/register' ||
                     pathname === '/auth/reset-password' ||
                     pathname === '/auth/new-password';

  // 3. Если пользователь авторизован (кука есть) и пытается зайти на гостевые страницы
  if (token && isAuthPage) {
    // Вытаскиваем текущую локаль из пути или берем дефолтную 'ru'
    const locale = pathname.startsWith('/en') ? 'en' : 'ru';
    
    // Редиректим его на главную страницу или страницу профиля (смотря куда тебе нужно)
    // Давай перенаправим на /dashboard/settings, как мы и планировали
    return NextResponse.redirect(new URL(`/${locale}/dashboard/settings`, request.url));
  }

  // 4. Если условий для редиректа нет, просто отдаем управление локализации next-intl
  return handleI18nRouting(request);
}

export const config = {
  // Защищаем корень, все локализированные пути и весь раздел /auth/
  matcher: ['/', '/(ru|en)/:path*', '/auth/:path*']
};
