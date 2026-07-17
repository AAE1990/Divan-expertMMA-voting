import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Строго Promise по спецификации Next.js 15
}

// 1. Динамическая генерация метаданных для страницы голосований/турниров
export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;

  // Подтягиваем переводы из пространства имен "Voting" (или проверь как у тебя в json называется этот блок)
  const t = await getTranslations({ locale, namespace: 'Voting' });

  // Получаем базовый заголовок из переводов или ставим дефолт
  const votingTitle = t('title') || (locale === 'ru' ? 'Голосование' : 'Voting');
  const votingDesc = t('subtitle') || (locale === 'ru' ? 'Сделай свой прогноз на главные поединки ММА' : 'Make your predictions on the main MMA fights');
  const siteBrand = 'Couch Expert MMA';

  return {
    title: `${votingTitle} | ${siteBrand}`,
    description: votingDesc,
    openGraph: {
      title: `${votingTitle} | ${siteBrand}`,
      description: votingDesc,
      type: 'website',
      url: 'https://www.couch-expert-mma.com',
      siteName: siteBrand,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      images: [
        {
          url: 'https://www.couch-expert-mma.com/images/og-preview.png', // Твоя общая обложка из папки public/images
          width: 1200,
          height: 630,
          alt: siteBrand,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${votingTitle} | ${siteBrand}`,
      description: votingDesc,
      images: ['https://www.couch-expert-mma.com/images/og-preview.png'],
    },
  };
}

// 2. Серверный макет-обертка
export default async function VotingLayout({ children, params }: LayoutProps) {
  await params;
  return <>{children}</>;
}
