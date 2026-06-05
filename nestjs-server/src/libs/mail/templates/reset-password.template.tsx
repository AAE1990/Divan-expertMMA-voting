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
    const isEn = locale === 'en';

    return (
        <Tailwind>
            <Html>
                <Body className="text-black">
                    <Heading>{isEn ? 'Password Reset' : 'Сброс пароля'}</Heading>
                    <Text>
                        {isEn 
                            ? 'Hello! You requested a password reset. Please click the link below to create a new password:' 
                            : 'Привет! Вы запросили сброс пароля. Пожалуйста, перейдите по следующей ссылке, чтобы создать новый пароль:'}
                    </Text>
                    <Link href={resetLink}>
                        {isEn ? 'Confirm Password Reset' : 'Подтвердить сброс пароля'}
                    </Link>
                    <Text>
                        {isEn 
                            ? 'This link is valid for 1 hour. If you did not request a password reset, please ignore this email.' 
                            : 'Эта ссылка действительна в течение 1 часа. Если вы не запрашивали сброс пароля, просто проигнорируйте это сообщение.'}
                    </Text>
                </Body>
            </Html>
        </Tailwind>
    );
}