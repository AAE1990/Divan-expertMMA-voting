'use client'

import { Card, CardContent, CardHeader, CardTitle, Loading, Switch } from "@/shared/components/ui";
import { useProfile } from "@/shared/hooks";
import { UserButton, UserButtonLoading } from "./UserButton";
import { useForm } from "react-hook-form";
import { SettingsSchema, TypeSettingsSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { useUpdateProfileMutation } from "@/features/auth/hooks/useUpdateProfileMutation";
import { Trophy } from "lucide-react";
import { PredictionsHistory } from "./PredictionsHistory";
import { useState } from "react";

export function SettingsFrom() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const { user, isLoading } = useProfile(page, limit)
    const { update, isLoadingUpdate } = useUpdateProfileMutation()

    const form = useForm<TypeSettingsSchema>({
        resolver: zodResolver(SettingsSchema),
        values: {
            name: user?.displayName || '',
            email: user?.email || '',
            isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
            bio: user?.bio || '',
            city: user?.city || '',
            country: user?.country || '',
            youtube: user?.youtube || '',
            telegram: user?.telegram || '',
            vk: user?.vk || '',
            twitter: user?.twitter || '',
            instagram: user?.instagram || ''
        }
    })

    const onSubmit = (values: TypeSettingsSchema) => {
        update(values)
    }

    if (!user) return null

    const totalVotes = user.totalVotes || 0
    const totalPages = Math.ceil(totalVotes / limit)

    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
            {/* ШАПКА ПРОФИЛЯ */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/10 p-6 rounded-2xl border border-border/50">
                <div className="flex items-center gap-4">
                    {/* Твоя кнопка-аватарка теперь большая и статусная */}
                    <div className="scale-150 ml-2">
                        {isLoading ? <UserButtonLoading /> : <UserButton user={user} />}
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-black uppercase tracking-tight">{user.displayName}</h1>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                    </div>
                </div>
                
                {/* МЕСТО В РЕЙТИНГЕ ПЕРЕЕХАЛО В ШАПКУ */}
                <div className="flex items-center gap-6 px-6 py-3 bg-background/50 rounded-xl border border-primary/20 shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-primary tracking-widest">Твое место</p>
                        <p className="text-2xl font-black">{user.rank || 1}</p>
                    </div>
                    <Trophy className="text-primary size-8" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ЛЕВАЯ КОЛОНКА: НАСТРОЙКИ (7 из 12 колонок) */}
                <div className="lg:col-span-7">
                    <Card className="shadow-none border-none bg-transparent">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="text-lg font-bold uppercase tracking-wider text-center mb-4">Настройки</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6">
                            {isLoading ? <Loading /> : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Имя</FormLabel>
                                                    <FormControl><Input placeholder="Иван" disabled={isLoadingUpdate} {...field} className="bg-background" /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Email</FormLabel>
                                                    <FormControl><Input placeholder="your@example.com" disabled={isLoadingUpdate} type='email' {...field} className="bg-background" /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='isTwoFactorEnabled'
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border bg-background/50 p-4 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="font-bold">2FA</FormLabel>
                                                        <FormDescription className="text-[11px]">Дополнительная защита аккаунта</FormDescription>
                                                    </div>
                                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Биография, город, страна */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Дополнительная информация</h3>
                                            <FormField
                                                control={form.control}
                                                name='bio'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Биография (макс. 100 символов)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Расскажите о себе..."
                                                                disabled={isLoadingUpdate}
                                                                {...field}
                                                                className="bg-background"
                                                                maxLength={100}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name='city'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Город</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Москва" disabled={isLoadingUpdate} {...field} className="bg-background" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='country'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Страна</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Россия" disabled={isLoadingUpdate} {...field} className="bg-background" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Социальные сети */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Социальные сети</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name='youtube'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">YouTube</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="username" disabled={isLoadingUpdate} {...field} className="bg-background" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='telegram'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Telegram</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="username" disabled={isLoadingUpdate} {...field} className="bg-background" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='vk'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">VK</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="username" disabled={isLoadingUpdate} {...field} className="bg-background" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='twitter'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">X (Twitter)</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="username" disabled={isLoadingUpdate} {...field} className="bg-background" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='instagram'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Instagram</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="username" disabled={isLoadingUpdate} {...field} className="bg-background" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <Button type='submit' disabled={isLoadingUpdate} className="w-full font-bold uppercase tracking-widest">
                                            {isLoadingUpdate ? "Сохранение..." : "Сохранить профиль"}
                                        </Button>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ПРАВАЯ КОЛОНКА: ИСТОРИЯ (5 из 12 колонок) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* БЛОК СТАТИСТИКИ */}
                    <div className="rounded-2xl border bg-secondary/5 p-4">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-center mb-4">Статистика</h3>
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
                    </div>

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
                                    className="cursor-pointer"
                                >
                                    Назад
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page >= totalPages}
                                    className="cursor-pointer"
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
