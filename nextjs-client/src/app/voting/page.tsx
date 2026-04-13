'use client'

import { useGetPolls } from "@/features/voting/hooks/useGetPolls"
import { VotingCard } from "@/features/voting/components/VotingCard"
import { Loading } from "@/shared/components/ui"

export default function VotingPage() {
    const { data: polls, isLoading, error } = useGetPolls()

    // 1. Сначала крутим лоадер, пока ждем ответ
    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loading />
            </div>
        )
    }

    // 2. Если ответ пришел с ошибкой (как сейчас, пока нет сервера) — показываем это
    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center text-red-500 font-medium">
                Произошла ошибка при загрузке голосований
            </div>
        )
    }

    // 3. И только если всё ок — рендерим список
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Активные голосования</h1>

            {polls && polls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {polls.map((poll) => (
                        <VotingCard key={poll.id} poll={poll} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground">На данный момент активных боев нет.</p>
            )}
        </div>
    )
}
