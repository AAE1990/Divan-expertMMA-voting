"use client"

import Link from "next/link"
import { Button } from "./Button"
import { Skeleton } from "./Skeleton"
import { useProfile } from "@/shared/hooks"
import { LogIn, UserPlus } from "lucide-react"

export function AuthButtons() {
  const { user, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    )
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