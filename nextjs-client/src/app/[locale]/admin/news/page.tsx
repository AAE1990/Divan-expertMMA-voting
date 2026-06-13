'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getCreateNewsSchema, TCreateNewsSchema } from "@/features/news/schemes/news.schema"
import { useCreateNews } from "@/features/news/hooks/useCreateNews"
import { Card, CardContent, CardHeader, CardTitle, Loading } from "@/shared/components/ui/"
import { Input } from "@/shared/components/ui"
import { Label } from "@/shared/components/ui"
import { Button } from "@/shared/components/ui"
import { useRouter } from "@/i18n/routing"
import { useProfile } from "@/shared/hooks"
import { useEffect } from "react"
import { useTranslations } from "next-intl"

export default function AdminNewsPage() {
    const { user, isLoading: isProfileLoading } = useProfile()
    const { mutate: createNews, isPending } = useCreateNews()
    const router = useRouter()
    const t = useTranslations('AdminNews')

    const { register, handleSubmit, formState: { errors } } = useForm<TCreateNewsSchema>({
        resolver: zodResolver(getCreateNewsSchema(t)),
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
                    <CardTitle className="text-2xl font-black">{t('createNewsTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('titleLabel')}</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        id="titleRu"
                                        placeholder={t('titlePlaceholderRu') || "Заголовок на русском"}
                                        {...register("titleRu")}
                                        className={errors.titleRu ? "border-destructive" : ""}
                                    />
                                    {errors.titleRu && (
                                        <p className="text-sm text-destructive">{errors.titleRu.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        id="titleEn"
                                        placeholder={t('titlePlaceholderEn') || "Заголовок на английском"}
                                        {...register("titleEn")}
                                        className={errors.titleEn ? "border-destructive" : ""}
                                    />
                                    {errors.titleEn && (
                                        <p className="text-sm text-destructive">{errors.titleEn.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">{t('contentLabel')}</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <textarea
                                        id="contentRu"
                                        placeholder={t('contentPlaceholderRu') || "Текст новости на русском"}
                                        rows={6}
                                        {...register("contentRu")}
                                        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.contentRu ? "border-destructive" : ""}`}
                                    />
                                    {errors.contentRu && (
                                        <p className="text-sm text-destructive">{errors.contentRu.message}</p>
                                    )}
                                </div>
                                <div>
                                    <textarea
                                        id="contentEn"
                                        placeholder={t('contentPlaceholderEn') || "Текст новости на английском"}
                                        rows={6}
                                        {...register("contentEn")}
                                        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.contentEn ? "border-destructive" : ""}`}
                                    />
                                    {errors.contentEn && (
                                        <p className="text-sm text-destructive">{errors.contentEn.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">{t('imageUrlLabel')}</Label>
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

                        <Button type="submit" disabled={isPending} className="w-full cursor-pointer">
                            {isPending ? t('creatingButton') : t('publishNewsButton')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}