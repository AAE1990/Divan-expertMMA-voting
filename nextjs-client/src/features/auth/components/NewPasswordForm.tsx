"use client"

import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NewPasswordSchema, TypeNewPasswordSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNewPasswordMutation } from "../hooks";
import { toast } from "sonner";
import { AuthWrapper } from "./AuthWrapper";
import ReCAPTCHA from "react-google-recaptcha"
import { Button } from "@/shared/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { PasswordInput } from "@/shared/components/ui";
import { useSearchParams } from "next/navigation";

export function NewPasswordForm() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
          password: ''
        },
      })

    const { newPassword, isLoadingNew } = useNewPasswordMutation()

    const onSubmit = (values: TypeNewPasswordSchema) => {
        if (!token) {
            toast.error('Ссылка недействительна')
            return
        }
        if (recaptchaValue) {
            newPassword({ values, recaptcha: recaptchaValue })
        } else {
            toast.error('Пожалуйста, подтвердите, что вы не робот.')
        }
    }

    // Если токена нет, показываем сообщение
    if (!token) {
        return (
            <AuthWrapper
                heading="Ссылка недействительна"
                description="Проверьте правильность ссылки для восстановления пароля"
                backButtonLabel="Вернуться на главную"
                backButtonHref="/"
            >
                <div className="text-left space-y-2">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Возможно, ссылка устарела или была использована ранее.
                    </p>
                </div>
            </AuthWrapper>
        )
    }

    return (
        <AuthWrapper
            heading="Новый пароль"
            description="Придумайте новый пароль для вашего аккаунта"
            backButtonLabel="Войти в аккаунт"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="********"
                                        disabled={isLoadingNew}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex justify-center mx-auto">
                        <ReCAPTCHA
                            sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
                            onChange={setRecaptchaValue}
                            theme={theme === "light" ? "light" : "dark"}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoadingNew || !recaptchaValue}>
                        Продолжить
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
