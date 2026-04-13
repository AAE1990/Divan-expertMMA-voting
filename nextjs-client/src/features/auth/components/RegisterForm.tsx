// src/features/auth/components/RegisterForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RegisterSchema, TypeRegisterSchema } from "../schemes"
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

export function RegisterForm() {
  const {theme} = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
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
      toast.error('Пожалуйста, подтвердите, что вы не робот')
    }
  }

  return (
    <AuthWrapper
      heading="Регистрация"
      description="Чтобы войти на сайт введите ваш email и пароль"
      backButtonLabel="Уже есть аккаунт? Войти"
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
                <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Иван"
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
                <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@example.com"
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
                <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
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
                <FormLabel>Повторите пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********" 
                      disabled={isLoadingRegister}
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

          <Button type="submit" className="w-full" disabled={isLoadingRegister || !recaptchaValue}>
            Создать аккаунт
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}