'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { votingSchema, TVotingSchema } from "../schemes/voting.schema"
import { IPoll } from "../types/voting.types"
import { useSubmitVote } from "../hooks/useSubmitVote"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Label } from "@/shared/components/ui/Label"
import { Button } from "@/shared/components/ui/Button"
import { Progress } from "@/shared/components/ui/progress"
import { cn } from "@/shared/utils"

interface VotingCardProps {
  poll: IPoll
}

export const VotingCard = ({ poll }: VotingCardProps) => {

  const { mutate: submitVote, isPending } = useSubmitVote()

  // 1. Проверяем, голосовал ли юзер
  const hasVoted = !!poll.userVoteOptionId

  // 2. Считаем общие голоса для процентов
  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votesCount || 0), 0)

  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<TVotingSchema>({
    resolver: zodResolver(votingSchema),
  })

  const selectedValue = watch("optionId")

  const onSubmit = (data: TVotingSchema) => {
    submitVote({
      pollId: poll.id,
      optionId: data.optionId
    })
  }

  const isExpired = new Date(poll.expiresAt).getTime() < new Date().getTime()

  return (
    <Card className="w-full max-w-md mx-auto mb-6 flex flex-col h-full shadow-lg border-2">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
        <CardDescription>
          {hasVoted ? "Результаты боя" : "Выберите победителя"}
        </CardDescription>
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

              return (
                <div key={option.id} className="group">
                  <div className="flex justify-between mb-2 items-center">
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isUserChoice && "text-primary font-bold"
                    )}>
                      {option.text} {isUserChoice && "✅"}
                    </span>
                    <span className="text-xs font-bold bg-muted px-2 py-1 rounded">
                      {percentage}%
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn("h-3", isUserChoice ? "bg-secondary" : "bg-muted")}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 text-right italic">
                    Всего голосов: {option.votesCount}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          /* --- РЕЖИМ ГОЛОСОВАНИЯ --- */
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
                  {/* Теперь Label — это ГЛАВНЫЙ контейнер, он занимает всё пространство */}
                  <Label
                    htmlFor={option.id}
                    className="flex items-center space-x-3 w-full p-4 cursor-pointer"
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="shrink-0" // Чтобы кружочек не сплющивался
                    />
                    <span className="flex-1 font-semibold uppercase tracking-wider text-sm text-sky-900 dark:text-sky-100">
                      {option.text}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </form>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t">
        {!hasVoted ? (
          <Button
            form={`form-${poll.id}`}
            type="submit"
            className="w-full font-bold uppercase"
            disabled={isPending || poll.status === 'CLOSED' || isExpired}
          >
            {isExpired ? "Голосование завершено" : isPending ? "Отправка..." : "Сделать прогноз"}
          </Button>
        ) : (
          <div className="w-full text-center text-sm font-medium text-muted-foreground">
            Вы уже сделали свой выбор
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
