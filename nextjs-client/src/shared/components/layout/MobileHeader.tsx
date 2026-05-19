'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet'
import { Sidebar } from '@/shared/components/ui/Sidebar'
import { ToggleTheme } from '@/shared/components/ui/ToggleTheme'
import { AuthButtons } from '@/shared/components/ui/AuthButtons'
import { LocaleSwitcher } from '@/shared/components/ui/LocaleSwitcher'
import { cn } from '@/shared/utils/clsx'

export const MobileHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Мобильная верхняя панель */}
      <div className="sticky top-0 z-50 flex md:hidden items-center justify-between w-full h-16 px-4 border-b bg-background shadow-sm">
        <div className="flex items-center gap-4 pr-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Открыть меню"
              >
                <Menu className="size-6 text-primary" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64" showCloseButton={false}>
              <SheetTitle className="sr-only">Навигация лиги</SheetTitle>
              <SheetDescription className="sr-only">Мобильное меню выбора разделов платформы</SheetDescription>
              <div className="relative h-full">
                <button
                  className="absolute top-4 right-4 p-2 rounded-md hover:bg-accent transition-colors z-10"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть меню"
                >
                  <X className="size-5" />
                </button>
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary truncate">Диванный эксперт</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <AuthButtons />
          <LocaleSwitcher />
          <ToggleTheme />
        </div>
      </div>

      {/* Десктопная шапка (скрыта на мобилках) */}
      <div className="hidden md:flex items-center justify-end gap-4 p-4">
        <AuthButtons />
        <LocaleSwitcher />
        <ToggleTheme />
      </div>
    </>
  )
}