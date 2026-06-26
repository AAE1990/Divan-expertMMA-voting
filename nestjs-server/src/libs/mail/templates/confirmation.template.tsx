import { Heading, Link, Body, Text, Tailwind } from "@react-email/components"
import { Html } from "@react-email/html"

interface ConfirmationTemplateProps {
    domain: string
    token: string
    locale?: string
}

export function ConfirmationTemplate({
    domain,
    token,
    locale = 'en'
}: ConfirmationTemplateProps) {
    const confirmLink = `${domain}/${locale}/auth/new-verification?token=${token}`
    const isEn = locale === 'en';

    return (
        <Tailwind>
            <Html>
                <Body className="text-black">
                    <Heading>{isEn ? 'Email Verification' : 'Подтверждение почты'}</Heading>
                    <Text>
                        {isEn
                            ? 'Thank you for registering! Please verify your email by clicking the link below:'
                            : 'Спасибо за регистрацию! Пожалуйста, подтвердите ваш email, перейдя по ссылке:'}
                    </Text>
                    <Link href={confirmLink}>{isEn ? 'Verify Email' : 'Подтвердить почту'}</Link>
                </Body>
            </Html>
        </Tailwind>
    )
}
