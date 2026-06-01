import { Heading, Link, Body, Text, Tailwind } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from "react"

interface ResetPasswordTemplateProps {
    domain: string;
    token: string;
    locale?: string;
}

export function ResetPasswordTemplate({ domain, token, locale = 'en' }: ResetPasswordTemplateProps) {
    const resetLink = `${domain}/${locale}/auth/new-password?token=${token}`;

    return (
        <Tailwind>
            <Html>
                <Body className="text-black">
                    <Heading>Сброс пароля</Heading>
                    <Text>
                        Привет! Вы запросили сброс пароля. Пожалуйста, перейдите по следующей ссылке, чтобы создать новый пароль:
                    </Text>
                    <Link href={resetLink}>Подтвердить сброс пароля</Link>
                    <Text>
                        Эта ссылка действительна в течение 1 часа. Если вы не запрашивали сброс пароля, просто проигнорируйте это сообщение.
                    </Text>
                </Body>
            </Html>
        </Tailwind>
    );
}