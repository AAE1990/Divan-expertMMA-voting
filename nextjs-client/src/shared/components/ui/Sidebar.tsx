'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/clsx'
import { Vote, Home, Settings, ShieldAlert, Trophy } from 'lucide-react' // Добавил ShieldAlert
import { useProfile } from '@/shared/hooks'

const MENU_ITEMS = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/voting', label: 'Голосование', icon: Vote },
  { href: '/dashboard/settings', label: 'Настройки профиля', icon: Settings },
  { href: '/rating', label: 'Рейтинг', icon: Trophy }
]

export const Sidebar = () => {
  const pathname = usePathname()
  const { user, isLoading } = useProfile()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background p-4 shadow-sm">
      <div className="flex h-full flex-col justify-between overflow-hidden">
        <div className="space-y-4 min-w-0">
          <div className="px-3 py-2 text-xl font-bold tracking-tight text-primary truncate">
            Fight Analytics
          </div>

          <nav className="flex flex-col gap-2">
            {/* Рендерим основные пункты меню */}
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "outline"}
                  className={cn(
                    "w-full justify-start overflow-hidden gap-3 transition-all border-1",
                    isActive ? "border-primary bg-secondary" : "border-transparent"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3 w-full min-w-0">
                    <Icon className="size-5 text-primary shrink-0" />
                    <span className={cn("truncate", isActive && "font-bold")}>
                      {item.label}
                    </span>
                  </Link>
                </Button>
              )
            })}

            {/* Ссылка для АДМИНА — появляется под списком с разделителем */}
            {user?.role === 'ADMIN' && (
              <>
                <div className="my-2 border-t border-border" />
                <Button
                  asChild
                  variant={pathname === '/admin/voting' ? "secondary" : "outline"}
                  className={cn(
                    "w-full justify-start overflow-hidden gap-3 transition-all border-1 border-red-500/20 hover:border-red-500/50",
                    pathname === '/admin/voting' ? "border-red-500 bg-red-500/10" : "border-transparent"
                  )}
                >
                  <Link href="/admin/voting" className="flex items-center gap-3 w-full min-w-0">
                    <ShieldAlert className="size-5 text-red-500 shrink-0" />
                    <span className={cn("truncate", pathname === '/admin/voting' && "font-bold text-red-500")}>
                      Админ-панель
                    </span>
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>

        {/* Нижний блок (прижат к низу) */}
        <div className="space-y-2 mb-15">
          {user && (
            <div className="px-3 py-2 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="size-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Score</span>
              </div>
              <span className="text-sm font-black text-primary">
                {isLoading ? "..." : user.score}
              </span>
            </div>
          )}

          {/* <div className="px-3 py-2 text-xs text-muted-foreground italic">
            v 0.1.0 Alpha
          </div> */}
        </div>
      </div>
    </aside>
  )
}
