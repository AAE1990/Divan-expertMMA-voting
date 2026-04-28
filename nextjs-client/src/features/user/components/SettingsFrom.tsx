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

export function SettingsFrom() {
    const { user, isLoading } = useProfile()
    const { update, isLoadingUpdate } = useUpdateProfileMutation()

    const form = useForm<TypeSettingsSchema>({
        resolver: zodResolver(SettingsSchema),
        values: {
            name: user?.displayName || '',
            email: user?.email || '',
            isTwoFactorEnabled: user?.isTwoFactorEnabled || false
        }
    })

    const onSubmit = (values: TypeSettingsSchema) => {
        update(values)
    }

    if (!user) return null

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
                
                {/* БАЛЛЫ ПЕРЕЕХАЛИ В ШАПКУ */}
                <div className="flex items-center gap-6 px-6 py-3 bg-background/50 rounded-xl border border-primary/20 shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-primary tracking-widest">Твой рейтинг</p>
                        <p className="text-2xl font-black">{user.score || 0}</p>
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
                    <h2 className="text-lg font-bold uppercase tracking-wider text-center mb-4">История прогнозов</h2>
                    <div className="rounded-2xl border bg-secondary/5 p-2 min-h-[300px]">
                        <PredictionsHistory votes={user?.votes || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
