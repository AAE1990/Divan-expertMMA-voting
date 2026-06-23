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

  return {
    title: `${t('title')} | My Fight Club`, // Будет: "Топ прогнозистов | My Fight Club"
    description: 'Рейтинг лучших аналитиков и прогнозистов лиги. Угадывай исходы боев и поднимайся на первое место!',
    openGraph: {
      title: `${t('title')} | My Fight Club`,
      type: 'website',
    },
  };
}

export default async function LeaderboardLayout({ children, params }: LayoutProps) {
  await params; 
  return <>{children}</>;
}
