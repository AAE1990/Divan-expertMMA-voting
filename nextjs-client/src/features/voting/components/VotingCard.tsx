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
import { Clock, Swords } from "lucide-react"
import { useRouter } from "@/i18n/routing"


interface VotingCardProps {
  poll: IPoll
}

export const VotingCard = ({ poll }: VotingCardProps) => {
  const t = useTranslations('Voting')
  const locale = useLocale()
  const router = useRouter()

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

  // Вспомогательная функция для рендеринга фото бойца
  const renderFighterPhoto = (option: any) => {
    if (!option.photoUrl) return null
    return (
      <div className="mb-3 w-full max-w-[200px] md:max-w-[240px] aspect-[3/4] overflow-hidden rounded-xl shadow-md bg-neutral-900 mx-auto">
        <img
          src={option.photoUrl}
          alt={locale === 'en' ? option.textEn : option.textRu}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const text = locale === 'en' ? 'Photo+Not+Found' : 'Фото+не+найдено'
            e.currentTarget.src = `https://placeholder.com{text}`
          }}
        />
      </div>
    )
  }

  // Центральный блок VS
  const renderCenterBlock = () => {
    const isClosed = poll.status === 'CLOSED'
    const isOpen = poll.status === 'OPEN'
    return (
      <div className="flex flex-col items-center justify-center gap-1 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-900 to-black border-4 border-red-800 shadow-2xl">
          <Swords className="text-white size-6 md:size-8" />
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-black tracking-tighter text-red-700 uppercase">VS</div>
          <div className="text-[10px] md:text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-widest">
            {isFinished ? t('fightFinished') : isClosed ? t('votingEnded') : t('live')}
          </div>
          {!isFinished && !isClosed && (
            <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-amber-600">
              <Clock className="size-3" />
              <span>{new Date(poll.expiresAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Блок бойца для режима результатов (hasVoted)
  const renderFighterResult = (option: any, isLeft: boolean) => {
    const percentage = totalVotes > 0 ? Math.round((option.votesCount / totalVotes) * 100) : 0
    const isUserChoice = option.id === poll.userVoteOptionId
    const isWinner = !poll.isPeopleChamp && option.id === poll.winnerOptionId

    return (
      <div className={cn(
        "flex flex-col items-center w-full p-3 md:p-4",
        isLeft ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"
      )}>
        {/* Фото */}
        {renderFighterPhoto(option)}
        {/* Имя и индикаторы */}
        <div className={cn(
          "flex flex-col w-full",
          isLeft ? "lg:items-end" : "lg:items-start"
        )}>
          <div className="flex items-center justify-between w-full mb-2">
            <span className={cn(
              "text-sm font-bold uppercase tracking-wide transition-colors",
              isUserChoice && "text-primary",
              isWinner && "text-green-600",
              isLeft ? "lg:order-2" : "lg:order-1"
            )}>
              {locale === 'en' ? option.textEn : option.textRu}
              {isUserChoice && " ✅"}
              {isWinner && " 🏆"}
            </span>
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded",
              isWinner ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-muted",
              isLeft ? "lg:order-1" : "lg:order-2"
            )}>
              {percentage}%
            </span>
          </div>
          {/* Прогресс-бар */}
          <Progress
            value={percentage}
            className={cn(
              "h-2 w-full",
              isWinner ? "bg-green-500" : isUserChoice ? "bg-secondary" : "bg-muted"
            )}
          />
          <p className="text-[10px] text-muted-foreground mt-1 italic">
            {t('totalVotes')} {option.votesCount}
          </p>
        </div>
      </div>
    )
  }

  // Блок бойца для режима голосования (user, не голосовал)
  const renderFighterVoting = (option: any, isLeft: boolean) => {
    return (
      <div
        onClick={() => setValue("optionId", option.id)} // МАГИЯ ЗДЕСЬ! Клик по карточке выбирает бойца!
        className={cn(
          "flex flex-col items-center w-full p-3 md:p-4 border-2 rounded-xl transition-all",
          "bg-gradient-to-b from-sky-50 to-white border-sky-200 hover:border-sky-400 hover:shadow-md",
          "dark:from-slate-900 dark:to-black dark:border-slate-800 dark:hover:border-slate-600",
          selectedValue === option.id && "border-primary ring-2 ring-primary/30",
          isLeft ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"
        )}>
        {renderFighterPhoto(option)}
        <Label
          htmlFor={option.id}
          className="flex flex-col items-center w-full mt-2 cursor-pointer"
        >
          <div className="flex items-center justify-center w-full mb-2">
            <div
              className={`shrink-0 border-2 rounded-full size-5 flex items-center justify-center transition-all ${selectedValue === option.id
                ? "border-primary bg-primary shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                : "border-muted-foreground/30 bg-transparent"
                }`}
            >
              {/* Маленькая точка внутри активного чекбокса */}
              {selectedValue === option.id && <div className="size-2 rounded-full bg-white" />}
            </div>
            <span className="flex-1 font-black uppercase tracking-wider text-sm text-sky-900 dark:text-sky-100 mx-3">
              {locale === 'en' ? option.textEn : option.textRu}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground italic">{t('clickToVote')}</span>
        </Label>
      </div>
    )
  }

  // Блок бойца для анонимного просмотра
  const renderFighterAnonymous = (option: any, isLeft: boolean) => {
    return (
      <div className={cn(
        "flex flex-col items-center w-full p-3 md:p-4 border rounded-xl opacity-60",
        "bg-sky-50 border-sky-200",
        "dark:bg-slate-900 dark:border-slate-800",
        isLeft ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"
      )}>
        {renderFighterPhoto(option)}
        <div className="mt-2 text-center">
          <span className="font-bold uppercase tracking-wider text-sm text-sky-900 dark:text-sky-100">
            {locale === 'en' ? option.textEn : option.textRu}
          </span>
        </div>
      </div>
    )
  }

  // Основной контент карточки в зависимости от режима
  const renderFightCardContent = () => {
    // Если опций не 2, откатываемся к вертикальному стеку (на всякий случай)
    if (poll.options.length !== 2) {
      // Возвращаем старый вертикальный рендер (упрощённо)
      return (
        <div className="space-y-6 py-2">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votesCount / totalVotes) * 100) : 0
            const isUserChoice = option.id === poll.userVoteOptionId
            const isWinner = !poll.isPeopleChamp && option.id === poll.winnerOptionId
            return (
              <div key={option.id} className="group">
                {option.photoUrl && (
                  <div className="mb-3 w-full aspect-square overflow-hidden rounded-xl shadow-md bg-neutral-900">
                    <img
                      src={option.photoUrl}
                      alt={locale === 'en' ? option.textEn : option.textRu}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="flex justify-between mb-2 items-center">
                  <span className={cn("text-sm font-medium", isUserChoice && "text-primary font-bold", isWinner && "text-green-600 font-bold")}>
                    {locale === 'en' ? option.textEn : option.textRu}
                    {isUserChoice && " ✅"}
                    {isWinner && " 🏆"}
                  </span>
                  <span className={cn("text-xs font-bold px-2 py-1 rounded", isWinner ? "bg-green-100 text-green-800" : "bg-muted")}>
                    {percentage}%
                  </span>
                </div>
                <Progress value={percentage} className={cn("h-3", isWinner ? "bg-green-500" : isUserChoice ? "bg-secondary" : "bg-muted")} />
                <p className="text-[10px] text-muted-foreground mt-1 text-right italic">{t('totalVotes')} {option.votesCount}</p>
              </div>
            )
          })}
        </div>
      )
    }

    const [fighter1, fighter2] = poll.options

return (
  <div className="flex flex-col lg:flex-row items-stretch justify-between gap-2 w-full">
    
    {/* Левый боец — принудительно делит место поровну */}
    <div className="flex-1 w-full lg:w-1/2">
      {hasVoted 
        ? renderFighterResult(fighter1, true) 
        : user 
          ? renderFighterVoting(fighter1, true) 
          : renderFighterAnonymous(fighter1, true)}
    </div>

    {/* Центральный блок VS */}
    <div className="flex justify-center items-center py-2 lg:py-0 px-0 lg:px-2 shrink-0"> {/* Добавили shrink-0, чтобы круг VS никогда не сжимался */}
      {renderCenterBlock()}
    </div>

    {/* Правый боец — принудительно делит место поровну */}
    <div className="flex-1 w-full lg:w-1/2">
      {hasVoted 
        ? renderFighterResult(fighter2, false) 
        : user 
          ? renderFighterVoting(fighter2, false) 
          : renderFighterAnonymous(fighter2, false)}
    </div>

  </div>
)
  }

  return (
    <Card className={cn(
      "w-full max-w-4xl mx-auto mb-6 flex flex-col h-full shadow-2xl border-2",
      isFinished && "border-yellow-500/50"
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg md:text-xl">{locale === 'en' ? poll.questionEn : poll.questionRu}</CardTitle>
            <CardDescription>
              {isFinished ? t('fightFinished') : t('chooseWinner')}
            </CardDescription>
          </div>
          {isFinished && <Trophy className="text-yellow-500 size-6" />}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Форма для голосования (скрытая, но нужна для сабмита) */}
        {user && !hasVoted && (
          <form onSubmit={handleSubmit(onSubmit)} id={`form-${poll.id}`} className="hidden">
            <RadioGroup value={selectedValue} onValueChange={(v) => setValue("optionId", v)}>
              {poll.options.map(opt => (
                <RadioGroupItem key={opt.id} value={opt.id} id={opt.id} />
              ))}
            </RadioGroup>
          </form>
        )}

        {renderFightCardContent()}

        {/* Панель админа */}
        {isAdmin && !isFinished && !poll.isPeopleChamp && (
          <div className="mt-8 pt-6 border-t border-dashed border-primary/30">
            <p className="text-[10px] uppercase font-bold text-primary mb-3 text-center tracking-widest">
              {t('judgePanel')}
            </p>
            <div className="grid grid-cols-2 gap-3">
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

      {/* Футер с кнопкой прогноза */}
      <CardFooter className="pt-4 border-t">
        {user ? (
          // 1. ПОЛЬЗОВАТЕЛЬ АВТОРИЗОВАН
          !hasVoted ? (
            <Button
              form={`form-${poll.id}`}
              type="submit"
              className="w-full font-bold uppercase py-3"
              disabled={isPending || poll.status === 'CLOSED' || isExpired}
            >
              {isExpired ? t('votingEnded') : isPending ? t('submitting') : t('makePrediction')}
            </Button>
          ) : (
            <div className="w-full text-center text-sm font-medium text-muted-foreground">
              {t('alreadyVoted')}
            </div>
          )
        ) : (
          // 2. ПОЛЬЗОВАТЕЛЬ — АНОНИМ (Выводим красивую интерактивную кнопку!)
          <Button
            variant="outline"
            className="w-full font-bold uppercase py-3 border-dashed border-primary/40 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
            onClick={() => router.push(`/auth/login`)} // Улетает на логин!
          >
            {t('loginToVoteAction')}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
