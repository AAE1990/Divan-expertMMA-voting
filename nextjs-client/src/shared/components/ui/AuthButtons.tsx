"use client"

import { LogIn, UserPlus } from "lucide-react"
import Cookies from "js-cookie"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/routing"
import { Button } from "./Button"
import { Skeleton } from "./Skeleton"
import { useProfile } from "@/shared/hooks/useProfile"

export function AuthButtons() {
    const { user, isLoading } = useProfile()
    const pathname = usePathname()
    const t = useTranslations("Auth")

    // Синхронно проверяем наличие сессионной куки из браузера
    const hasSessionCookie = !!Cookies.get('session')

    // 1. Если мы находимся на страницах авторизации — сразу скрываем кнопки
    if (pathname?.startsWith("/auth")) {
        return null
    }

    // 2. Если куки сессии вообще нет в браузере — пользователь ТОЧНО гость.
    // Рендерим кнопки мгновенно, не дожидаясь сетевого ответа от бэкенда!
    if (!hasSessionCookie) {
        return (
            <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="sm:gap-2 gap-1 sm:px-3 px-2">
                    <Link href="/auth/login">
                        <LogIn className="size-4" />
                        <span className="hidden sm:inline">{t('loginTitle')}</span>
                    </Link>
                </Button>
                <Button asChild size="sm" className="sm:gap-2 gap-1 sm:px-3 px-2">
                    <Link href="/auth/register">
                        <UserPlus className="size-4" />
                        <span className="hidden sm:inline">{t('registerTitle')}</span>
                    </Link>
                </Button>
            </div>
        )
    }

    // 3. Если кука есть, значит идет проверка сессии — показываем скелетоны
    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
            </div>
        )
    }

    // 4. Если пользователь авторизован, не показываем кнопки
    if (user) {
        return null
    }

    return null
}
