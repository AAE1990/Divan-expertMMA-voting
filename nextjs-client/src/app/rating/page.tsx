'use client'

import { useState } from "react";
import { useLeaderboard } from "@/features/user/hooks/useLeaderboard";
import { Card, CardContent, Loading, Button, Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Trophy, Medal, Calendar } from "lucide-react";
import { cn } from "@/shared/utils/clsx";
import Link from "next/link";

export default function RatingPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');
  const { data: leaderboardData, isLoading } = useLeaderboard(page, limit, period);

  const handlePeriodChange = (value: 'all' | 'month' | 'week') => {
    setPeriod(value);
    setPage(1); // Сбрасываем на первую страницу при смене периода
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loading /></div>;

  const users = leaderboardData?.users || [];
  const totalUsers = leaderboardData?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Trophy className="size-10 text-yellow-500" />
          <h1 className="text-4xl font-black uppercase tracking-tighter">Топ прогнозистов</h1>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-muted-foreground" />
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всё время</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="week">За неделю</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="p-4 font-bold uppercase text-xs">Место</th>
                  <th className="p-4 font-bold uppercase text-xs">Участник</th>
                  <th className="p-4 font-bold uppercase text-xs text-right">Баллы</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const isTop3 = index < 3;
                  return (
                    <tr key={user.id} className={cn(
                      "border-b last:border-0 hover:bg-primary/5 transition-colors",
                      isTop3 && "bg-yellow-500/5 dark:bg-yellow-500/10"
                    )}>
                      <td className="p-4">
                        <div className="flex items-center justify-center size-8 rounded-full font-bold bg-muted">
                          {index === 0 ? <Medal className="text-yellow-500 size-5" /> : index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link href={`/profile/${user.id}`} className="flex items-center gap-3 hover:underline">
                          <Avatar className="size-8">
                            <AvatarImage src={user.picture || ''} alt={user.displayName} />
                            <AvatarFallback className="text-xs">
                              {user.displayName?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{user.displayName || "Аноним"}</span>
                        </Link>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xl font-black text-primary">{user.score}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalUsers > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-muted-foreground">
            Страница {page} из {totalPages} (всего {totalUsers} участников)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="cursor-pointer"
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="cursor-pointer"
            >
              Вперед
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
