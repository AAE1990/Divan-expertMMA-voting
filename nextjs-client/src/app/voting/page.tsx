'use client'

import { useState } from "react"
import { useGetPolls } from "@/features/voting/hooks/useGetPolls"
import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments"
import { VotingCard } from "@/features/voting/components/VotingCard"
import { Button } from "@/shared/components/ui/Button"
import { Loading } from "@/shared/components/ui"
import { cn } from "@/shared/utils/clsx"

export default function VotingPage() {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | undefined>()

  const { data: tournaments, isLoading: isTournamentsLoading } = useGetTournaments()
  const { data: polls, isLoading: isPollsLoading } = useGetPolls(selectedTournamentId)

  // Если турниры загрузились, а у нас еще ничего не выбрано — можно выбрать первый (самый свежий)
  if (!selectedTournamentId && tournaments && tournaments.length > 0) {
    setSelectedTournamentId(tournaments[0].id)
  }

  if (isTournamentsLoading) return <div className="flex h-screen items-center justify-center"><Loading /></div>

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-black mb-8 text-center uppercase tracking-tighter italic">
        Линия прогнозов
      </h1>

      {/* Переключатель турниров */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 border-b pb-6">
        {tournaments?.map((t) => (
          <Button
            key={t.id}
            variant={selectedTournamentId === t.id ? "default" : "outline"}
            onClick={() => setSelectedTournamentId(t.id)}
            className={cn(
              "rounded-full transition-all",
              selectedTournamentId === t.id && "scale-105 shadow-md"
            )}
          >
            {t.name}
          </Button>
        ))}
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
