"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./Button"
import { DropdownMenu } from "./DropdownMenu"
import { DropdownMenuTrigger } from "./DropdownMenu"
import { DropdownMenuContent } from "./DropdownMenu"
import { DropdownMenuItem } from "./DropdownMenu"

export function ToggleTheme() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-5 right-5 z-50" asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Смена темы</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Светлая
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Тёмная
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
