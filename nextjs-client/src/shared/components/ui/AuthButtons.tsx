"use client"

import Link from "next/link"
import { Button } from "./Button"
import { Skeleton } from "./Skeleton"
import { useProfile } from "@/shared/hooks"
import { usePathname } from "next/navigation"; // 1. Импортируем хук пути
import { LogIn, UserPlus } from "lucide-react"

export function AuthButtons() {
  const { user, isLoading } = useProfile()
  const pathname = usePathname()

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
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href="/auth/login">
          <LogIn className="size-4" />
          Вход
        </Link>
      </Button>
      <Button asChild size="sm" className="gap-2">
        <Link href="/auth/register">
          <UserPlus className="size-4" />
          Регистрация
        </Link>
      </Button>
    </div>
  )
}