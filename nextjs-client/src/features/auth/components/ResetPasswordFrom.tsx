"use client"

import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getResetPasswordSchema, TypeResetPasswordSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "../hooks";
import { toast } from "sonner";
import { AuthWrapper } from "./AuthWrapper";
import ReCAPTCHA from "react-google-recaptcha"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { useTranslations, useLocale } from "next-intl";

export function ResetPasswordFrom() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
    const t = useTranslations('Auth')
    const locale = useLocale()

    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(getResetPasswordSchema(t)),
        defaultValues: {
            email: "",
        },
    })

    const { reset, isLoadingReset } = useResetPasswordMutation()

    const onSubmit = (values: TypeResetPasswordSchema) => {
        if (recaptchaValue) {
            reset({ values, recaptcha: recaptchaValue })
        } else {
            toast.error(t('pleaseConfirmCaptcha'))
        }
    }

    return (
        <AuthWrapper
            heading={t('resetPasswordTitle')}
            description={t('resetPasswordDescription')}
            backButtonLabel={t('backToLogin')}
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
                                <FormLabel>{t('email')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('emailPlaceholder')}
                                        disabled={isLoadingReset}
                                        type="email"
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
                            hl={locale} // МАГИЯ ЗДЕСЬ! Передает 'ru' или 'en' напрямую в Google!
                        />
                    </div>

                    <Button type="submit" className="w-full px-4" disabled={isLoadingReset || !recaptchaValue}>
                        {t('resetButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
