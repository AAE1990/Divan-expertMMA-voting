"use client"

import { useEffect, useState } from "react"
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
    
    // Состояние для проверки, загрузился ли компонент в браузере
    const [isMounted, setIsMounted] = useState(false)

    // useEffect срабатывает ТОЛЬКО в браузере. Сервер этот код пропустит.
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // 1. Если мы на страницах авторизации — сразу скрываем кнопки
    if (pathname?.startsWith("/auth")) {
        return null
    }

    // 2. Пока компонент не примонтировался в браузере, показываем пустые скелетоны,
    // чтобы у сервера и браузера был одинаковый стартовый HTML (защита от багов гидратации)
    if (!isMounted) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
            </div>
        )
    }

    // Теперь мы на 100% в браузере и можем безопасно читать куку!
    const hasSessionCookie = !!Cookies.get('session')

    // 3. Если куки нет — пользователь точно гость, выводим кнопки БЕЗ задержек
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

    // 4. Если кука есть, значит юзер залогинен или сессия проверяется — ждем хук
    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
            </div>
        )
    }

    // 5. Если пользователь успешно авторизован, скрываем кнопки
    if (user) {
        return null
    }

    return null
}
