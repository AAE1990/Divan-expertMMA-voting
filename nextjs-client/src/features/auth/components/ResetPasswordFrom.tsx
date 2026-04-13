"use client"

import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema, TypeResetPasswordSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "../hooks";
import { toast } from "sonner";
import { AuthWrapper } from "./AuthWrapper";
import ReCAPTCHA from "react-google-recaptcha"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";

export function ResetPasswordFrom() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const { reset, isLoadingReset } = useResetPasswordMutation()

    const onSubmit = (values: TypeResetPasswordSchema) => {
        if (recaptchaValue) {
            reset({ values, recaptcha: recaptchaValue })
        } else {
            toast.error('Пожалуйста, подтвердите, что вы не робот.')
        }
    }

    return (
        <AuthWrapper
            heading="Сброс пароля"
            description="Для сброса пароля введите свою почту"
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
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Почта</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="your@example.com"
                                        disabled={isLoadingReset}
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
                            onChange={setRecaptchaValue}
                            theme={theme === "light" ? "light" : "dark"}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoadingReset || !recaptchaValue}>
                        Сбросить
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
