"use client"

import { Link, usePathname } from "@/i18n/routing"
import { Button } from "./Button"
import { Skeleton } from "./Skeleton"
import { useProfile } from "@/shared/hooks"
import { LogIn, UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"

export function AuthButtons() {
  const { user, isLoading } = useProfile()
  const pathname = usePathname()
  const t = useTranslations('Auth')

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    )
  }

   // 3. Если мы находимся на страницах логина/регистрации/сброса — скрываем кнопки
  if (pathname?.startsWith("/auth")) {
    return null
  }

  // Если пользователь авторизован, не показываем кнопки
  if (user) {
    return null
  }

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