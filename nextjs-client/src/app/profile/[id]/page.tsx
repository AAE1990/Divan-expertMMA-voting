'use client'

import { useParams } from "next/navigation"
import { userService } from "@/features/user/services/user.services"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, Loading, Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui"
import { Trophy, MapPin, Globe, Youtube, Send, MessageSquare, Twitter, Instagram } from "lucide-react"
import { PredictionsHistory } from "@/features/user/components/PredictionsHistory"
import { Button } from "@/shared/components/ui/Button"
import { useState } from "react"
import Link from "next/link"

export default function PublicProfilePage() {
    const params = useParams()
    const id = params.id as string
    const [page, setPage] = useState(1)
    const limit = 5

    const { data: user, isLoading } = useQuery({
        queryKey: ['publicProfile', id, page, limit],
        queryFn: () => userService.getPublicProfile(id, page, limit),
    })

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Пользователь не найден</h1>
                <p className="text-muted-foreground mt-2">Возможно, профиль был удалён или скрыт.</p>
                <Link href="/rating">
                    <Button className="mt-6">Вернуться к рейтингу</Button>
                </Link>
            </div>
        )
    }

    const totalVotes = user.totalVotes || 0
    const totalPages = Math.ceil(totalVotes / limit)

    const socialLinks = [
        { platform: 'youtube', username: user.youtube, icon: Youtube, url: `https://youtube.com/${user.youtube}` },
        { platform: 'telegram', username: user.telegram, icon: Send, url: `https://t.me/${user.telegram}` },
        { platform: 'vk', username: user.vk, icon: MessageSquare, url: `https://vk.com/${user.vk}` },
        { platform: 'twitter', username: user.twitter, icon: Twitter, url: `https://twitter.com/${user.twitter}` },
        { platform: 'instagram', username: user.instagram, icon: Instagram, url: `https://instagram.com/${user.instagram}` },
    ].filter(link => link.username)

    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
            {/* ШАПКА ПРОФИЛЯ */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/10 p-6 rounded-2xl border border-border/50">
                <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage src={user.picture || ''} alt={user.displayName} />
                        <AvatarFallback className="text-2xl">
                            {user.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">{user.displayName}</h1>
                        <p className="text-muted-foreground text-sm">Участник с {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'не определенной даты'}</p>
                        
                        {/* Биография */}
                        {user.bio && (
                            <p className="mt-3 text-sm text-foreground/80 max-w-lg">{user.bio}</p>
                        )}

                        {/* Город и страна */}
                        {(user.city || user.country) && (
                            <div className="flex items-center gap-4 mt-3">
                                {user.city && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="size-4" />
                                        <span>{user.city}</span>
                                    </div>
                                )}
                                {user.country && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Globe className="size-4" />
                                        <span>{user.country}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Социальные сети */}
                        {socialLinks.length > 0 && (
                            <div className="flex items-center gap-3 mt-4">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.platform}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-background border hover:bg-primary/10 transition-colors"
                                        title={`${link.platform}: ${link.username}`}
                                    >
                                        <link.icon className="size-5" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* МЕСТО В РЕЙТИНГЕ */}
                <div className="flex items-center gap-6 px-6 py-3 bg-background/50 rounded-xl border border-primary/20 shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-primary tracking-widest">Место в рейтинге</p>
                        <p className="text-3xl font-black">{user.rank || 1}</p>
                    </div>
                    <Trophy className="text-primary size-10" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ЛЕВАЯ КОЛОНКА: ИНФОРМАЦИЯ */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="shadow-none border-none bg-transparent">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="text-lg font-bold uppercase tracking-wider text-left pl-4 border-l-4 border-primary">Статистика</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border bg-secondary/5 p-4">
                                    <p className="text-xs uppercase font-bold text-muted-foreground">Всего прогнозов</p>
                                    <p className="text-2xl font-black mt-2">{totalVotes}</p>
                                </div>
                                <div className="rounded-xl border bg-secondary/5 p-4">
                                    <p className="text-xs uppercase font-bold text-muted-foreground">Точность</p>
                                    <p className="text-2xl font-black mt-2">
                                        {user.correctVotes ?? 0}
                                        <span className="text-sm text-muted-foreground"> / {totalVotes}</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Дополнительная информация (если есть) */}
                    {(user.youtube || user.telegram || user.vk || user.twitter || user.instagram) && (
                        <Card className="shadow-none border-none bg-transparent">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="text-lg font-bold uppercase tracking-wider text-left pl-4 border-l-4 border-primary">Социальные сети</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4">
                                <div className="flex flex-wrap gap-3">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.platform}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-full border bg-background hover:bg-primary/10 transition-colors"
                                        >
                                            <link.icon className="size-4" />
                                            <span className="text-sm font-medium">{link.username}</span>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ПРАВАЯ КОЛОНКА: ИСТОРИЯ ПРОГНОЗОВ */}
                <div className="lg:col-span-5 space-y-4">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-center mb-4">История прогнозов</h2>
                    <div className="rounded-2xl border bg-secondary/5 p-2 min-h-[300px]">
                        <PredictionsHistory votes={user?.votes || []} />
                    </div>
                    {totalVotes > 0 && (
                        <div className="flex items-center justify-between px-2">
                            <div className="text-sm text-muted-foreground">
                                Страница {page} из {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page <= 1}
                                >
                                    Назад
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page >= totalPages}
                                >
                                    Вперед
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}