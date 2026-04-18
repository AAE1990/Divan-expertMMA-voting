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

export function SettingsFrom() {
    const { user, isLoading } = useProfile()

    const form = useForm<TypeSettingsSchema>({ // <--- сохраняем в 'form'
        resolver: zodResolver(SettingsSchema),
        values: {
            name: user?.displayName || '',
            email: user?.email || '',
            isTwoFactorEnabled: user?.isTwoFactorEnabled || false
        }
    })

    const { update, isLoadingUpdate } = useUpdateProfileMutation()

    const onSubmit = (values: TypeSettingsSchema) => {
        update(values)
    }

    if (!user) return null

    return (
        <div className="flex flex-col lg:flex-row items-start gap-6 max-w-5xl mx-auto p-4">
            {/* Кнопка вне карточки, позиционируется абсолютно относительно layout */}
            <Card className="w-[400px]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Настройки профиля</CardTitle>
                    {isLoading ? <UserButtonLoading /> : <UserButton user={user} />}
                </CardHeader>
                <CardContent>
                    {isLoading ?
                        <Loading /> : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 space-y-2">
                                    {/* Имя */}
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Имя</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Иван"
                                                        disabled={isLoadingUpdate}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="your@example.com"
                                                        disabled={isLoadingUpdate}
                                                        type='email'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Switch */}
                                    <FormField
                                        control={form.control}
                                        name='isTwoFactorEnabled'
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center
                                        justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Двухфакторная аутентификация
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Включите двухфакторную аутентификацию для вашей учетной записи
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="border border-black/50"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' disabled={isLoadingUpdate}>Сохранить</Button>
                                </form>
                            </Form>
                        )}
                </CardContent>
            </Card>

            {/* Правая колонка: Статистика */}
            <div className="w-full lg:w-[300px]">
                <Card className="border-primary/20 bg-primary/5 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-full border border-primary/20 shadow-inner">
                                <Trophy className="text-primary size-8" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
                                    Статистика
                                </p>
                                <p className="text-sm font-medium text-muted-foreground">Набрано баллов</p>
                            </div>
                            <div className="text-6xl font-black text-primary tracking-tighter">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-[60px]">
                                        <Loading /> {/* Твой компонент крутилки */}
                                    </div>
                                ) : (
                                    user?.score || 0
                                )}
                            </div>

                            {/* Декоративная линия для солидности */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-2" />

                            <p className="text-[10px] text-muted-foreground italic">
                                Продолжайте угадывать бои, чтобы подняться в рейтинге!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
