"use client"

import { Button } from "./Button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./DropdownMenu"
import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { Globe } from "lucide-react"
import { cn } from "@/shared/utils/clsx"

const locales = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇺🇸" },
] as const

export function LocaleSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleLocaleChange = (newLocale: string) => {
    // Используем router.push с опцией locale для смены локали на том же пути
    router.push(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-md border-border bg-background hover:bg-accent cursor-pointer"
          aria-label="Переключить язык"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Переключить язык</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-card border-border">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentLocale === locale.code && "bg-accent font-semibold"
            )}
          >
            <span className="text-lg">{locale.flag}</span>
            <span>{locale.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}