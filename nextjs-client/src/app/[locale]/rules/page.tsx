'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui"
import { Scale, Shield, Users, MessageSquare, AlertTriangle, Trophy, BookOpen } from "lucide-react"

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Scale className="size-10 text-primary" />
          <h1 className="text-4xl font-black uppercase tracking-tighter">Правила сайта</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Обновлено: 15 мая 2026
        </p>
      </div>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="size-5" />
            Общие положения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Добро пожаловать на платформу прогнозов на бои! Наш сервис создан для сообщества любителей единоборств,
            где каждый может участвовать в голосованиях, строить прогнозы и соревноваться в рейтинге.
          </p>
          <p>
            Используя наш сайт, вы соглашаетесь с приведёнными ниже правилами. Автор сервиса оставляет за собой право
            вносить изменения в правила, уведомляя пользователей через публикацию обновлённой версии на этой странице.
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="size-5" />
            Уважительное общение
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              В наших группах и социальных сетях, связанных с сервисом, запрещены оскорбления, дискриминация,
              разжигание ненависти и троллинг.
            </li>
            <li>
              Критика должна быть конструктивной и уважительной. Помните, что за аватарами стоят реальные люди.
            </li>
            <li>
              Администрация оставляет за собой право удалять комментарии и блокировать пользователей, нарушающих
              эти принципы, без предупреждения.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="size-5" />
            Запрещённые действия
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Спам и флуд</strong> – многократная отправка однотипных сообщений, реклама сторонних ресурсов
              без согласования.
            </li>
            <li>
              <strong>Накрутка голосов</strong> – использование скриптов, ботов или создание множества аккаунтов
              для искусственного влияния на результаты голосований.
            </li>
            <li>
              <strong>Распространение вредоносного ПО</strong> – ссылки на вирусы, фишинговые сайты и т.п.
            </li>
            <li>
              <strong>Попытки взлома</strong> – сканирование уязвимостей, SQL-инъекции, DDOS-атаки на инфраструктуру.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            При обнаружении подобных действий аккаунт нарушителя будет заблокирован, а данные переданы правоохранительным
            органам при необходимости.
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="size-5" />
            Безопасность и модерация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Автор сервиса оставляет за собой право принимать окончательные решения по вопросам организации,
            безопасности и модерации ресурса. Это включает, но не ограничивается:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Удаление контента, противоречащего правилам.</li>
            <li>Блокировка пользователей, нарушающих правила.</li>
            <li>Корректировка рейтинга при выявлении нечестной игры.</li>
            <li>Временное или постоянное ограничение доступа к определённым функциям.</li>
          </ul>
          <p>
            Если вы столкнулись с нарушением правил другим пользователем или обнаружили техническую проблему,
            сообщите об этом через раздел «Обратная связь» или на почту поддержки.
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="size-5" />
            Система рейтинга
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Рейтинг пользователей рассчитывается на основе точности прогнозов в голосованиях. Чем чаще ваш прогноз
            совпадает с реальным исходом боя, тем выше ваша позиция в общем зачёте.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Как начисляются очки:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>За каждый правильный прогноз вы получаете <strong className="text-primary">1 балл</strong>.</li>
              <li>Если прогноз оказался неверным – <strong>0 баллов</strong>.</li>
              <li>Голосования в разделе «Народный чемпион» баллов в рейтинг <strong className="text-red-500">не приносят</strong>.</li>
              <li>Рейтинг обновляется автоматически сразу после фиксации результата боя админом.</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Рейтинг является игровым показателем и не имеет денежного эквивалента. Администрация может изменять
            алгоритм расчёта, уведомляя пользователей заранее.
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="size-5" />
            Заключение
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Соблюдение этих правил делает наше сообщество комфортным и честным для всех. Если у вас остались вопросы,
            обратитесь к разделу «Часто задаваемые вопросы» или напишите в поддержку.
          </p>
          <p className="font-medium">
            Пользуясь сайтом, вы подтверждаете, что ознакомились с правилами и принимаете их.
          </p>
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>© 2026 Прогнозы на бои. Все права защищены.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}