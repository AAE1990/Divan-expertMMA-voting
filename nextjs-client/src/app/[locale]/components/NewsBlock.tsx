'use client'

import { useGetLatestNews } from "@/features/news/hooks/useGetLatestNews";
import { Loading } from "@/shared/components/ui";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export function NewsBlock() {
  const { data: news, isLoading, error } = useGetLatestNews();
  const t = useTranslations('NewsBlock');
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-10 flex justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 rounded-2xl bg-secondary/5 border border-white/5 text-center">
        <p className="text-muted-foreground">{t('noNews')}</p>
      </div>
    );
  }

  const formattedDate = new Date(news.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-8 rounded-2xl bg-secondary/5 border border-white/5 text-left space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-black uppercase italic">{news.title}</h3>
          <span className="text-sm text-muted-foreground whitespace-nowrap">{formattedDate}</span>
        </div>
        {news.imageUrl && (
          <div className="rounded-xl overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full aspect-video object-cover rounded-xl"
            />
          </div>
        )}
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {news.content}
        </div>
        <div className="pt-4 border-t border-white/5">
          <Link
            href="/news"
            className="text-primary hover:underline font-bold inline-flex items-center gap-2"
          >
            {t('seeAll')}
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}