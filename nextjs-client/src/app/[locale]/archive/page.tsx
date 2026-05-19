'use client'

import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments";
import { Card, CardHeader, CardTitle, CardDescription, Input, Button, Skeleton } from "@/shared/components/ui";
import { Loading } from "@/shared/components/ui";
import { useProfile, useDebounce } from "@/shared/hooks";
import { Link } from "@/i18n/routing";
import { CalendarDays, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function ArchivePage() {
  const [page, setPage] = useState(1);
  const limit = 10; // Количество турниров на странице
  const [searchTerm, setSearchTerm] = useState(""); // Состояние для текста поиска
  const debouncedSearchTerm = useDebounce(searchTerm, 400); // Задержка 400мс
  const { user, isLoading: isProfileLoading } = useProfile();
  const { data: tournamentsData, isLoading } = useGetTournaments(page, limit, debouncedSearchTerm);

  // При изменении поискового запроса сбрасываем страницу на первую
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const totalPages = tournamentsData?.totalTournaments
    ? Math.ceil(tournamentsData.totalTournaments / limit)
    : 0;

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const showSkeleton = isLoading || isProfileLoading;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter italic text-center">
        Архив событий
      </h1>

      {/* ПОЛЕ ПОИСКА */}
      <div className="relative mb-8 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Поиск турнира (например, UFC 300)..."
          className="pl-10 rounded-full border-2 focus:border-primary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={showSkeleton}
        />
      </div>

      <div className="relative min-h-[60vh]">
        {showSkeleton ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {tournamentsData?.tournaments?.length ? (
              tournamentsData.tournaments.map((t) => (
                <Link key={t.id} href={`/voting?tournamentId=${t.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {t.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <CalendarDays className="size-3" />
                          {new Date(t.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Смотреть итоги
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10 italic">
                Ничего не найдено по запросу "{debouncedSearchTerm}"
              </p>
            )}
          </div>
        )}
        {!user && !isProfileLoading && !showSkeleton && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg p-6">
            <p className="text-xl font-bold text-foreground mb-4 text-center">
              Архив доступен только участникам лиги.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Войти</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/auth/register">Зарегистрироваться</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ПАГИНАЦИЯ */}
      {showSkeleton ? (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      ) : totalPages > 1 ? (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
