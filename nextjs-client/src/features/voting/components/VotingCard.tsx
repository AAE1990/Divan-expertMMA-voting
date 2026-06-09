'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { getVotingSchema, TVotingSchema } from "../schemes/voting.schema"
import { IPoll } from "../types/voting.types"
import { useSubmitVote } from "../hooks/useSubmitVote"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Label } from "@/shared/components/ui/Label"
import { Button } from "@/shared/components/ui/Button"
import { Progress } from "@/shared/components/ui/progress"
import { cn } from "@/shared/utils"
import { useFinishPoll } from "../hooks/useFinishPoll"
import { useProfile } from "@/shared/hooks/useProfile"
import { Trophy } from "lucide-react" // Для красоты
import { useTranslations, useLocale } from "next-intl"


interface VotingCardProps {
  poll: IPoll
}

export const VotingCard = ({ poll }: VotingCardProps) => {
  const t = useTranslations('Voting')
  const locale = useLocale()

  const { user } = useProfile()
  const { mutate: finishPoll, isPending: isFinishing } = useFinishPoll()

  const { mutate: submitVote, isPending } = useSubmitVote()

  // 1. Проверяем, голосовал ли юзер
  const hasVoted = !!poll.userVoteOptionId

  // 2. Считаем общие голоса для процентов
  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votesCount || 0), 0)

  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<TVotingSchema>({
    resolver: zodResolver(getVotingSchema(t)),
  })

  const selectedValue = watch("optionId")

  const onSubmit = (data: TVotingSchema) => {
    submitVote({
      pollId: poll.id,
      optionId: data.optionId
    })
  }

  const isAdmin = user?.role === 'ADMIN'
  const isFinished = poll.status === 'FINISHED'

  const handleFinish = (optionId: string) => {
    if (confirm(t('confirmFinish'))) {
      finishPoll({ pollId: poll.id, winnerOptionId: optionId })
    }
  }

  const isExpired = poll.isPeopleChamp ? false : new Date(poll.expiresAt).getTime() < new Date().getTime()

  return (
    <Card className={cn(
      "w-full max-w-md mx-auto mb-6 flex flex-col h-full shadow-lg border-2",
      isFinished && "border-yellow-500/50" // Подсветим завершенные бои золотым
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{locale === 'en' ? poll.questionEn : poll.questionRu}</CardTitle>
            <CardDescription>
              {isFinished ? t('fightFinished') : t('chooseWinner')}
            </CardDescription>
          </div>
          {isFinished && <Trophy className="text-yellow-500 size-6" />}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {hasVoted ? (
          /* --- РЕЖИМ РЕЗУЛЬТАТОВ --- */
          <div className="space-y-6 py-2">
            {poll.options.map((option) => {
              const percentage = totalVotes > 0
                ? Math.round((option.votesCount / totalVotes) * 100)
                : 0
              const isUserChoice = option.id === poll.userVoteOptionId
              // Победитель определяется только для обычных опросов (не People's Champion)
              const isWinner = !poll.isPeopleChamp && option.id === poll.winnerOptionId

              return (
                <div key={option.id} className="group">
                  {/* Добавляем фото бойца */}
                  {option.photoUrl && (
                    // 1. Убрали h-40, поставили идеальные пропорции постера aspect-[3/4]
                    <div className="mb-3 w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md bg-neutral-900">
                      <img
                        src={option.photoUrl}
                        // 2. Локализуем alt-текст на основе новой структуры базы данных
                        alt={locale === 'en' ? option.textEn : option.textRu}
                        // 3. Сменили фокус обрезки на object-top — головы и плечи теперь ВСЕГДА в кадре!
                        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-102"
                        onError={(e) => {
                          // 4. Локализуем заглушку, если картинка сломалась
                          const text = locale === 'en' ? 'Photo+Not+Found' : 'Фото+не+найдено';
                          e.currentTarget.src = `https://placeholder.com{text}`;
                        }}
                      />
                    </div>
                  )}
                  <div className="flex justify-between mb-2 items-center">
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isUserChoice && "text-primary font-bold",
                      isWinner && "text-green-600 font-bold"
                    )}>
                      {locale === 'en' ? option.textEn : option.textRu}
                      {isUserChoice && " ✅"}
                      {isWinner && " 🏆"}
                    </span>
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded",
                      isWinner ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-muted"
                    )}>
                      {percentage}%
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      "h-3",
                      isWinner ? "bg-green-500" : isUserChoice ? "bg-secondary" : "bg-muted"
                    )}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 text-right italic">
                    {t('totalVotes')} {option.votesCount}
                  </p>
                </div>
              )
            })}
          </div>
        ) : user ? (
          /* --- РЕЖИМ ГОЛОСОВАНИЯ (только для авторизованных) --- */
          <form onSubmit={handleSubmit(onSubmit)} id={`form-${poll.id}`}>
            <RadioGroup
              value={selectedValue}
              onValueChange={(v) => setValue("optionId", v)}
              className="space-y-4"
            >
              {poll.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "relative overflow-hidden border rounded-lg transition-colors",
                    "bg-sky-50 border-sky-200 hover:bg-sky-100",
                    "dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800"
                  )}
                >
                  {/* Добавляем фото бойца */}
                  {option.photoUrl && (
                    // 1. Убрали h-40, поставили идеальные пропорции постера aspect-[3/4]
                    <div className="mb-3 w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md bg-neutral-900">
                      <img
                        src={option.photoUrl}
                        // 2. Локализуем alt-текст на основе новой структуры базы данных
                        alt={locale === 'en' ? option.textEn : option.textRu}
                        // 3. Сменили фокус обрезки на object-top — головы и плечи теперь ВСЕГДА в кадре!
                        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-102"
                        onError={(e) => {
                          // 4. Локализуем заглушку, если картинка сломалась
                          const text = locale === 'en' ? 'Photo+Not+Found' : 'Фото+не+найдено';
                          e.currentTarget.src = `https://placeholder.com{text}`;
                        }}
                      />
                    </div>
                  )}
                  {/* Теперь Label — это ГЛАВНЫЙ контейнер, он занимает всё пространство */}
                  <Label
                    htmlFor={option.id}
                    className="flex items-center space-x-3 w-full p-4 cursor-pointer"
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="shrink-0 shadow-[0_0_5px_rgba(0,0,0,0.5)] border-2 border-primary" // Чтобы кружочек не сплющивался
                    />
                    <span className="flex-1 font-semibold uppercase tracking-wider text-sm text-sky-900 dark:text-sky-100">
                      {locale === 'en' ? option.textEn : option.textRu}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </form>
        ) : (
          /* --- РЕЖИМ ПРОСМОТРА ДЛЯ АНОНИМОВ --- */
          <div className="relative">
            <div className="space-y-4 opacity-50">
              {poll.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "relative overflow-hidden border rounded-lg",
                    "bg-sky-50 border-sky-200",
                    "dark:bg-slate-900 dark:border-slate-800"
                  )}
                >
                  {/* Добавляем фото бойца */}
                  {option.photoUrl && (
                    // 1. Убрали h-40, поставили идеальные пропорции постера aspect-[3/4]
                    <div className="mb-3 w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md bg-neutral-900">
                      <img
                        src={option.photoUrl}
                        // 2. Локализуем alt-текст на основе новой структуры базы данных
                        alt={locale === 'en' ? option.textEn : option.textRu}
                        // 3. Сменили фокус обрезки на object-top — головы и плечи теперь ВСЕГДА в кадре!
                        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-102"
                        onError={(e) => {
                          // 4. Локализуем заглушку, если картинка сломалась
                          const text = locale === 'en' ? 'Photo+Not+Found' : 'Фото+не+найдено';
                          e.currentTarget.src = `https://placeholder.com{text}`;
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="font-semibold uppercase tracking-wider text-sm text-sky-900 dark:text-sky-100">
                      {locale === 'en' ? option.textEn : option.textRu}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg p-6">
              <p className="text-lg font-medium text-foreground mb-4 text-center">
                {t('loginToVote')}
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">{t('login')}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">{t('register')}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* --- ПАНЕЛЬ АДМИНА (Добавляем в самый низ контента) --- */}
        {isAdmin && !isFinished && !poll.isPeopleChamp && (
          <div className="mt-6 pt-4 border-t border-dashed border-primary/30">
            <p className="text-[10px] uppercase font-bold text-primary mb-3 text-center tracking-widest">
              {t('judgePanel')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {poll.options.map((option) => (
                <Button
                  key={option.id}
                  size="sm"
                  variant="outline"
                  className="text-[10px] h-auto py-2 whitespace-normal border-primary/50 hover:bg-primary hover:text-white leading-tight"
                  onClick={() => handleFinish(option.id)}
                  disabled={isFinishing}
                >
                  {t('wonBy', { fighter: locale === 'en' ? option.textEn : option.textRu })}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* ... CardFooter ... */}
      {user && (
        <CardFooter className="pt-4 border-t">
          {!hasVoted ? (
            <Button
              form={`form-${poll.id}`}
              type="submit"
              className="w-full font-bold uppercase"
              disabled={isPending || poll.status === 'CLOSED' || isExpired}
            >
              {isExpired ? t('votingEnded') : isPending ? t('submitting') : t('makePrediction')}
            </Button>
          ) : (
            <div className="w-full text-center text-sm font-medium text-muted-foreground">
              {t('alreadyVoted')}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

