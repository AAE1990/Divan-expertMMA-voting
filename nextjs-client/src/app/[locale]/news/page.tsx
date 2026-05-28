'use client'

import { useGetNews } from "@/features/news/hooks/useGetNews";
import { Card, CardHeader, CardTitle, CardDescription, Button, Skeleton } from "@/shared/components/ui";
import { Loading } from "@/shared/components/ui";
import { useProfile } from "@/shared/hooks";
import { Link } from "@/i18n/routing";
import { CalendarDays, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const limit = 6; // Количество новостей на странице
  const { user, isLoading: isProfileLoading } = useProfile();
  const { data: newsData, isLoading } = useGetNews(page, limit);

  const totalPages = newsData?.totalNews
    ? Math.ceil(newsData.totalNews / limit)
    : 0;

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const tNews = useTranslations('News');
  const showSkeleton = isLoading || isProfileLoading;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Newspaper className="size-10 text-primary" />
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">{tNews('title')}</h1>
      </div>
      <p className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-10">
        {tNews('description')}
      </p>

      {showSkeleton ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="rounded-2xl overflow-hidden border-white/5">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <div className="p-6 pt-0">
                <Skeleton className="h-40 w-full rounded-xl mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {newsData?.news && newsData.news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.news.map((news) => (
                <Card key={news.id} className="rounded-2xl overflow-hidden border-white/5 hover:border-primary/30 transition-all duration-300">
                  {news.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-black uppercase italic line-clamp-2">
                        {news.title}
                      </CardTitle>
                      <CalendarDays className="size-5 text-muted-foreground flex-shrink-0" />
                    </div>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <span>
                        {new Date(news.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0">
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {news.content}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Newspaper className="size-20 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-black uppercase italic mb-2">{tNews('noNewsTitle')}</h3>
              <p className="text-muted-foreground">{tNews('noNewsDescription')}</p>
            </div>
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={page === 1}
                className="rounded-full"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="font-bold">
                {tNews('pagination.page')} {page} {tNews('pagination.of')} {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="rounded-full"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}