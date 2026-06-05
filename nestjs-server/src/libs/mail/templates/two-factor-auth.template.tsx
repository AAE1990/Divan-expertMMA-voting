import { Heading, Body, Text, Tailwind } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from "react"

interface TwoFactorAuthTemplateProps {
  token: string;
  locale?: string; // Добавили поддержку локали
}

export const TwoFactorAuthTemplate = ({ token, locale = 'en' }: TwoFactorAuthTemplateProps) => {
  const isEn = locale === 'en';

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>{isEn ? 'Two-Factor Authentication' : 'Двухфакторная авторизация'}</Heading>
          <Text>
            {isEn 
              ? <>Your two-factor authentication token: <strong>{token}</strong></>
              : <>Ваш токен для двухфакторной авторизации: <strong>{token}</strong></>}
          </Text>
          <Text>
            {isEn 
              ? 'Please enter this token in the application to complete the sign-in process.' 
              : 'Пожалуйста, введите этот токен в приложение для завершения процесса авторизации.'}
          </Text>
          <Text>
            {isEn 
              ? 'If you did not request two-factor authentication, please ignore this message.' 
              : 'Если вы не запрашивали двухфакторную авторизацию, просто проигнорируйте это сообщение.'}
          </Text>
          <Text>{isEn ? 'Thank you for using our service.' : 'Спасибо за использование нашего сервиса.'}</Text>
        </Body>
      </Html>
    </Tailwind>
  );
};