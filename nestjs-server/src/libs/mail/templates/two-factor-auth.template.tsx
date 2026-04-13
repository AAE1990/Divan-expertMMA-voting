import { Heading, Body, Text, Tailwind } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from "react"

interface TwoFactorAuthTemplateProps {
  token: string
}

export const TwoFactorAuthTemplate = ({token}: TwoFactorAuthTemplateProps) => {
  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Двухфакторная авторизация</Heading>
          <Text>
            Ваш токен для двухфакторной авторизации: <strong>{token}</strong>
          </Text>
          <Text>
            Пожалуйста, введите этот токен в приложение для завершения процесса авторизации.
          </Text>
          <Text>
            Если вы не запрашивали двухфакторную авторизацию, просто проигнорируйте это сообщение.
          </Text>
          <Text>Спасибо за использование нашего сервиса.</Text>
        </Body>
      </Html>
    </Tailwind>
  );
};