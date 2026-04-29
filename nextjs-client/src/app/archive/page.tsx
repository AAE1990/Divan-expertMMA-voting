'use client'

import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments";
import { Card, CardHeader, CardTitle, CardDescription, Input, Button } from "@/shared/components/ui";
import { Loading } from "@/shared/components/ui";
import Link from "next/link";
import { CalendarDays, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ArchivePage() {
  const [page, setPage] = useState(1);
  const limit = 10; // Количество турниров на странице
  const { data: tournamentsData, isLoading } = useGetTournaments(page, limit);
  const [searchTerm, setSearchTerm] = useState("") // Состояние для текста поиска

  // Фильтруем турниры "на лету" из текущей страницы
  const filteredTournaments = tournamentsData?.tournaments?.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = tournamentsData?.totalTournaments
    ? Math.ceil(tournamentsData.totalTournaments / limit)
    : 0;

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loading /></div>;

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
        />
      </div>

      <div className="grid gap-4">
        {filteredTournaments?.length ? (
          filteredTournaments.map((t) => (
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
            Ничего не найдено по запросу "{searchTerm}"
          </p>
        )}
      </div>

      {/* ПАГИНАЦИЯ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={page <= 1}
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
