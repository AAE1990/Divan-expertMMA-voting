"use client"

import { useEffect, useState } from "react"
import { LogIn, UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/routing"
import { Button } from "./Button"
import { Skeleton } from "./Skeleton"
import { useProfile } from "@/shared/hooks/useProfile"

export function AuthButtons() {
    const { user, isLoading } = useProfile()
    const pathname = usePathname()
    const t = useTranslations("Auth")
    
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // 1. Если мы на страницах авторизации — скрываем кнопки
    if (pathname?.startsWith("/auth")) {
        return null
    }

    // 2. Пока компонент полностью не ожил в браузере ИЛИ пока бэкенд проверяет профиль —
    // показываем заглушку-скелетон (это защитит от багов гидратации)
    if (!isMounted || isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
            </div>
        )
    }

    // 3. Если пользователь УЖЕ авторизован — убираем кнопки из шапки,
    // так как у тебя внизу сайдбара уже горит кнопка "Выйти"
    if (user) {
        return null
    }

    // 4. Если загрузка завершена и пользователя нет — это точно гость, выводим кнопки!
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
