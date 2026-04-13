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

export default function AdminVotingPage() {
    const { mutate: createPoll, isPending } = useCreatePoll()

    const { register, handleSubmit, formState: { errors } } = useForm<TCreatePollSchema>({
        resolver: zodResolver(createPollSchema),
        defaultValues: {
            question: "Кто победит в этом бою?"
        }
    })

    const onSubmit = (data: TCreatePollSchema) => {
        // Преобразуем данные из формы в формат, который ждет бэкенд
        createPoll({
            question: data.question,
            options: [data.fighter1, data.fighter2],
            expiresAt: data.expiresAt
        })
    }

    const { user, isLoading } = useProfile()
    const router = useRouter()

    // 1. Сначала ждем загрузку профиля
    if (isLoading) {
        return (
        <div className="flex h-screen items-center justify-center">
            <Loading />
        </div>
        )
    }

    // 2. Если профиля нет или роль не ADMIN — редирект
    // Важно: проверяй регистр 'ADMIN', в Prisma это обычно заглавные
    if (!user || user.role !== 'ADMIN') {
        router.push('/') // Отправляем на главную
        return null
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Создать новое голосование (ММА)</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Создание..." : "Опубликовать бой"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
