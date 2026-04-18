'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPollSchema, TCreatePollSchema } from "@/features/voting/schemes/voting.schema"
import { useCreatePoll } from "@/features/voting/hooks/useCreatePoll"
import { Card, CardContent, CardHeader, CardTitle, Loading } from "@/shared/components/ui/"
import { Input } from "@/shared/components/ui"
import { Label } from "@/shared/components/ui"
import { Button } from "@/shared/components/ui"
import { useRouter } from "next/navigation"
import { useProfile } from "@/shared/hooks"
import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments"
import { useCreateTournament } from "@/features/tournament/hooks/useCreateTournament"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useEffect } from "react"

export default function AdminVotingPage() {
    // 1. Сначала ВСЕ хуки без исключения
    const { user, isLoading: isProfileLoading } = useProfile()
    const { data: tournaments, isLoading: isTournamentsLoading } = useGetTournaments()
    const { mutate: createTournament } = useCreateTournament()
    const { mutate: createPoll, isPending } = useCreatePoll()
    const router = useRouter()

    // Форма боя теперь должна включать tournamentId
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<TCreatePollSchema & { tournamentId: string }>({
        resolver: zodResolver(createPollSchema), // Не забудь добавить tournamentId в Zod схему!
    })

    // 2. useEffect для редиректа тоже здесь
    useEffect(() => {
        if (!isProfileLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/')
        }
    }, [user, isProfileLoading, router])

    // 3. И ТОЛЬКО ТЕПЕРЬ условия отрисовки
    if (isProfileLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        )
    }


    // Функция для создания тестового турнира (чтобы не верстать пока всю форму)
    const handleQuickTournament = () => {
        const name = prompt("Название турнира (напр. UFC 300):")
        const date = new Date().toISOString()
        if (name) createTournament({ name, date })
    }

    const onSubmit = (data: TCreatePollSchema & { tournamentId: string }) => {
        createPoll({
            question: data.question,
            // Массив из двух бойцов, который на бэкенде превратится в Option[]
            options: [data.fighter1, data.fighter2],
            expiresAt: data.expiresAt,
            // ID турнира, который мы получили через Select и setValue
            tournamentId: data.tournamentId
        })
    }


    return (
        <div className="max-w-2xl mx-auto py-10 space-y-8">
            {/* Секция 1: Управление турнирами */}
            <Card className="border-dashed border-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Турниры</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleQuickTournament}>
                        + Быстрый турнир
                    </Button>
                </CardHeader>
            </Card>

            {/* Секция 2: Создание боя */}
            <Card>
                <CardHeader><CardTitle>Добавить бой в кард</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Выберите турнир</Label>
                            <Select onValueChange={(value) => setValue("tournamentId", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isTournamentsLoading ? "Загрузка..." : "Выберите ивент"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {tournaments?.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ... твои старые поля fighter1, fighter2, expiresAt ... */}
                        <div className="space-y-2">
                            <Label>Вопрос</Label>
                            <Input {...register("question")} placeholder="Например: Кто победит на UFC 300?" />
                            {errors.question && <p className="text-red-500 text-xs">{errors.question.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Боец 1</Label>
                                <Input {...register("fighter1")} placeholder="Имя Фамилия" />
                                {errors.fighter1 && <p className="text-red-500 text-xs">{errors.fighter1.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Боец 2</Label>
                                <Input {...register("fighter2")} placeholder="Имя Фамилия" />
                                {errors.fighter2 && <p className="text-red-500 text-xs">{errors.fighter2.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Дата и время завершения (МСК)</Label>
                            <Input type="datetime-local" {...register("expiresAt")} />
                            {errors.expiresAt && <p className="text-red-500 text-xs">{errors.expiresAt.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>Опубликовать</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
