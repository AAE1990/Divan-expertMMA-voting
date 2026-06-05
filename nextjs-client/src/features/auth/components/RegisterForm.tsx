// src/features/auth/components/RegisterForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { getRegisterSchema, TypeRegisterSchema } from "../schemes"
import { AuthWrapper } from "./AuthWrapper"
import { useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useRegisterMutation } from "../hooks"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { PasswordInput } from "@/shared/components/ui"
import { useLocale, useTranslations } from "next-intl"

export function RegisterForm() {
  const {theme} = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const t = useTranslations('Auth')
  const locale = useLocale()

  const form = useForm<TypeRegisterSchema>({
    resolver: zodResolver(getRegisterSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
  })

  const { registerMutation, isLoadingRegister } = useRegisterMutation()

  const onSubmit = (values: TypeRegisterSchema) => {
    if (recaptchaValue) {
        registerMutation({ values, recaptcha: recaptchaValue })
    } else {
      toast.error(t('pleaseConfirmCaptcha'))
    }
  }

  return (
    <AuthWrapper
      heading={t('registerTitle')}
      description={t('registerDescription')}
      backButtonLabel={t('backButtonLabelLogin')}
      backButtonHref="/auth/login"
      isShowSocial
    >

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name='name'
            render={({ field}) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('namePlaceholder')}
                      disabled={isLoadingRegister}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field}) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('emailPlaceholder')}
                      disabled={isLoadingRegister}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field}) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t('passwordPlaceholder')}
                      disabled={isLoadingRegister}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='passwordRepeat'
            render={({ field}) => (
              <FormItem>
                <FormLabel>{t('confirmPassword')}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t('passwordPlaceholder')}
                      disabled={isLoadingRegister}
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

          <Button type="submit" className="w-full px-4" disabled={isLoadingRegister || !recaptchaValue}>
            {t('createAccount')}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}