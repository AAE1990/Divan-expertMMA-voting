import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Строго Promise для Next.js 15
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;

  // Достаем перевод из пространства имен "Leaderboard", которое ты показал на скриншоте!
  const t = await getTranslations({ locale, namespace: 'Leaderboard' });

  const ratingTitle = t('title') || (locale === 'ru' ? 'Рейтинг экспертов' : 'Leaderboard');
  const ratingDesc = locale === 'ru'
    ? 'Рейтинг лучших аналитиков и прогнозистов лиги. Угадывай исходы боев и поднимайся на первое место!'
    : 'Leaderboard of the best forecasters in the league. Predict fights and climb to the top!';

  const siteBrand = 'Couch Expert MMA';

  return {
    title: `${ratingTitle} | ${siteBrand}`,
    description: ratingDesc,
    openGraph: {
      title: `${ratingTitle} | ${siteBrand}`,
      description: ratingDesc,
      type: 'website',
      url: 'https:// www. couch-expert-mma. com/' + locale + '/rating',
      siteName: siteBrand,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      images: [
        {
          url: 'https://www.couch-expert-mma.com/images/og-preview.png',
          width: 1200,
          height: 630,
          alt: siteBrand,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ratingTitle} | ${siteBrand}`,
      description: ratingDesc,
      images: ['https://www.couch-expert-mma.com/images/og-preview.png'],
    },
  };
}

export default async function LeaderboardLayout({ children, params }: LayoutProps) {
  await params;
  return <>{children}</>;
}
