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
        <>
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
        </>
    );
}
