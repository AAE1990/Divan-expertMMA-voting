'use client'

import { useEffect, useState } from "react"
import { useGetPolls } from "@/features/voting/hooks/useGetPolls"
import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments"
import { VotingCard } from "@/features/voting/components/VotingCard"
import { Button } from "@/shared/components/ui/Button"
import { Loading } from "@/shared/components/ui"
import { cn } from "@/shared/utils/clsx"
import Link from "next/link"
import { History } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VotingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlTournamentId = searchParams.get('tournamentId') // Берем ID из ссылки типа ?tournamentId=...

  // Оставляем стейт, но инициализируем его из URL
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | undefined>(urlTournamentId || undefined)

  const { data: tournaments, isLoading: isTournamentsLoading } = useGetTournaments()
  const { data: polls, isLoading: isPollsLoading } = useGetPolls(selectedTournamentId)
  // Оставляем только 5 последних турниров для верхней панели
  const activeTournaments = tournaments?.tournaments?.slice(0, 5) || [];
  // Находим объект выбранного турнира, чтобы вытащить его название
  const currentTournament = tournaments?.tournaments?.find(t => t.id === selectedTournamentId)

  // 2. Создаем функцию для смены турнира
  const handleTournamentChange = (id: string) => {
    setSelectedTournamentId(id)
    // Обновляем URL без перезагрузки страницы, чтобы он соответствовал выбору
    router.push(`/voting?tournamentId=${id}`, { scroll: false })
  }

  // 3. Упрощаем useEffect
  useEffect(() => {
    // Если в URL пусто, но турниры загрузились — выбираем первый
    if (!urlTournamentId && tournaments?.tournaments?.length && !selectedTournamentId) {
      handleTournamentChange(tournaments.tournaments[0].id)
    }
  }, [urlTournamentId, tournaments])

  if (isTournamentsLoading) return <div className="flex h-screen items-center justify-center"><Loading /></div>

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-black mb-2 text-center uppercase tracking-tighter italic italic">
        {currentTournament?.name || "Линия прогнозов"}
      </h1>
      <p className="text-center text-muted-foreground mb-8 text-xs uppercase tracking-[0.3em]">
        {currentTournament ? new Date(currentTournament.date).toLocaleDateString() : "Загрузка..."}
      </p>

      {/* Панель выбора турнира */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b pb-6">
        {activeTournaments.map((t) => (
          <Button
            key={t.id}
            variant={selectedTournamentId === t.id ? "default" : "outline"}
            onClick={() => setSelectedTournamentId(t.id)}
            className="rounded-full transition-all cursor-pointer"
          >
            {t.name}
          </Button>
        ))}

        {/* Кнопка "Архив" — ставим её в один ряд, но выделяем стилем */}
        <Button variant="ghost" asChild className="rounded-full gap-2 text-muted-foreground hover:text-primary">
          <Link href="/archive">
            <History className="size-4" />
            Архив
          </Link>
        </Button>
      </div>

      {isPollsLoading ? (
        <div className="flex justify-center py-20"><Loading /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls?.length ? (
            polls.map((poll) => <VotingCard key={poll.id} poll={poll} />)
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-20">
              В этом турнире пока нет активных боев для голосования.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
