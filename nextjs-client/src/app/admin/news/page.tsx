'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createNewsSchema, TCreateNewsSchema } from "@/features/news/schemes/news.schema"
import { useCreateNews } from "@/features/news/hooks/useCreateNews"
import { Card, CardContent, CardHeader, CardTitle, Loading } from "@/shared/components/ui/"
import { Input } from "@/shared/components/ui"
import { Label } from "@/shared/components/ui"
import { Button } from "@/shared/components/ui"
import { useRouter } from "next/navigation"
import { useProfile } from "@/shared/hooks"
import { useEffect } from "react"

export default function AdminNewsPage() {
    const { user, isLoading: isProfileLoading } = useProfile()
    const { mutate: createNews, isPending } = useCreateNews()
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<TCreateNewsSchema>({
        resolver: zodResolver(createNewsSchema),
    })

    // Редирект не-админов
    useEffect(() => {
        if (!isProfileLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/')
        }
    }, [user, isProfileLoading, router])

    if (isProfileLoading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
                <Loading />
            </div>
        )
    }

    if (!user || user.role !== 'ADMIN') {
        return null // пока useEffect редиректит
    }

    const onSubmit = (data: TCreateNewsSchema) => {
        const payload = {
            ...data,
            imageUrl: data.imageUrl || undefined,
        }
        createNews(payload)
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-black">Создание новости</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Заголовок</Label>
                            <Input
                                id="title"
                                placeholder="Введите заголовок новости"
                                {...register("title")}
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Текст новости</Label>
                            <textarea
                                id="content"
                                placeholder="Введите полный текст новости"
                                rows={6}
                                {...register("content")}
                                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.content ? "border-destructive" : ""}`}
                            />
                            {errors.content && (
                                <p className="text-sm text-destructive">{errors.content.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">URL изображения (необязательно)</Label>
                            <Input
                                id="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                {...register("imageUrl")}
                                className={errors.imageUrl ? "border-destructive" : ""}
                            />
                            {errors.imageUrl && (
                                <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? "Создание..." : "Опубликовать новость"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}