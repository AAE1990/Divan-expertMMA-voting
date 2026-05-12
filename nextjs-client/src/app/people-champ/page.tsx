'use client'

import { useProfile } from "@/shared/hooks"
import { Card, CardHeader, CardTitle, CardDescription, Button, Skeleton, Loading } from "@/shared/components/ui"
import Link from "next/link"
import { Scale, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { votingService } from "@/features/voting/services/voting.service"
import { VotingCard } from "@/features/voting/components/VotingCard"

export default function PeopleChampPage() {
  const [page, setPage] = useState(1)
  const limit = 5 // Количество опросов на странице
  const { user, isLoading: isProfileLoading } = useProfile()

  const { data: pollsData, isLoading } = useQuery({
    queryKey: ["people-champ-polls", page],
    queryFn: () => votingService.getPeopleChampPolls(page, limit),
  })

  const totalPages = pollsData?.pagination.totalPages || 0

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const showSkeleton = isLoading || isProfileLoading

  if (showSkeleton) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        <Loading />
      </div>
    )
  }

  // Если пользователь не авторизован, показываем сообщение как в архиве
  if (!user) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-4xl text-center">
        <Scale className="size-24 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">
          Народный чемпион
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Этот раздел доступен только участникам лиги.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/login">Войти</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/auth/register">Присоединиться</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex items-center justify-center mb-10">
        <Scale className="size-10 mr-4 text-primary" />
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
          Народный чемпион
        </h1>
      </div>

      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Голосования по спорным боям, которые не влияют на основной рейтинг, но показывают мнение комьюнити.
        Ваш голос важен!
      </p>

      <div className="relative min-h-[60vh]">
        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {pollsData?.polls?.length ? (
              pollsData.polls.map((poll) => (
                <div key={poll.id} className="flex justify-center">
                  <div className="w-full max-w-2xl">
                    <VotingCard poll={poll} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10 italic">
                Пока нет голосований в разделе «Народный чемпион».
              </p>
            )}
          </div>
        )}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}