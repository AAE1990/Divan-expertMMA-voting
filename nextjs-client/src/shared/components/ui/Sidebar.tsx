'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/clsx'
import { Vote, Home, Settings, ShieldAlert, Trophy, History, LogOut, Newspaper, Scale } from 'lucide-react' // Добавил Scale
import { useProfile } from '@/shared/hooks'
import { useLogoutMutation } from '@/features/user/hooks'

const MENU_ITEMS = [
  { href: '/', labelKey: 'home', icon: Home },
  { href: '/voting', labelKey: 'voting', icon: Vote },
  { href: '/people-champ', labelKey: 'peopleChamp', icon: Scale },
  { href: '/dashboard/settings', labelKey: 'profileSettings', icon: Settings },
  { href: '/rating', labelKey: 'leaderboard', icon: Trophy },
  { href: '/archive', labelKey: 'tournamentArchive', icon: History },
  { href: '/news', labelKey: 'news', icon: Newspaper }
]

export const Sidebar = () => {
  const pathname = usePathname()
  const { user, isLoading } = useProfile()
  const { logout, isLoadingLogout } = useLogoutMutation()
  const t = useTranslations('Sidebar')

  // Фильтруем пункты меню: для анонимов скрываем "Настройки профиля"
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    if (item.href === '/dashboard/settings') {
      return !!user // показываем только авторизованным
    }
    return true
  })

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background p-4 shadow-sm">
      <div className="flex h-full flex-col justify-between overflow-hidden">
        <div className="space-y-4 min-w-0">
          <div className="px-3 py-2 text-xl font-bold tracking-tight text-primary truncate">
            Fight Analytics
          </div>

          <nav className="flex flex-col gap-2">
            {/* Рендерим основные пункты меню */}
            {filteredMenuItems.map((item) => {
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
                      {t(item.labelKey)}
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
                      {t('pollsManagement')}
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === '/admin/news' ? "secondary" : "outline"}
                  className={cn(
                    "w-full justify-start overflow-hidden gap-3 transition-all border-1 border-blue-500/20 hover:border-blue-500/50 mt-2",
                    pathname === '/admin/news' ? "border-blue-500 bg-blue-500/10" : "border-transparent"
                  )}
                >
                  <Link href="/admin/news" className="flex items-center gap-3 w-full min-w-0">
                    <Newspaper className="size-5 text-blue-500 shrink-0" />
                    <span className={cn("truncate", pathname === '/admin/news' && "font-bold text-blue-500")}>
                      {t('newsManagement')}
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
            <>
              <div className="px-3 py-2 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="size-3 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {t('rankLabel')}
                  </span>
                </div>
                <span className="text-sm font-black text-primary">
                  {isLoading ? "..." : (user.rank ? user.rank : "—")}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-1 border-transparent hover:border-primary/30"
                onClick={() => logout()}
                disabled={isLoadingLogout}
              >
                <LogOut className="size-5 text-primary shrink-0" />
                <span className="truncate">{t('logOut')}</span>
              </Button>
            </>
          )}

          {/* <div className="px-3 py-2 text-xs text-muted-foreground italic">
            v 0.1.0 Alpha
          </div> */}
        </div>
      </div>
    </aside>
  )
}
