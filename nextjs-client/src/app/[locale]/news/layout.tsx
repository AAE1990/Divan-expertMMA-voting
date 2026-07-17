import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Теперь params — это строго Promise!
}

// 1. Динамическая генерация метаданных
export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  // Дожидаемся развертывания params, чтобы забрать текущую локаль
  const { locale } = await params; 
  
  // Подтягиваем переводы из пространства имен "News"
  const t = await getTranslations({ locale, namespace: 'News' });

  const newsTitleStr = t('newsTitle') || (locale === 'ru' ? 'Новости проекта' : 'Project News');
  const newsDesc = t('newsSubtitle') || (locale === 'ru' ? 'Главные обновления и события' : 'Main updates and events');
  
  const siteBrand = 'Couch Expert MMA';

  return {
    title: `${newsTitleStr} | ${siteBrand}`,
    description: newsDesc,
    openGraph: {
      title: `${newsTitleStr} | ${siteBrand}`,
      description: newsDesc,
      type: 'website',
      url: 'https:// www. couch-expert-mma. com/' + locale + '/news',
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
      title: `${newsTitleStr} | ${siteBrand}`,
      description: newsDesc,
      images: ['https://www.couch-expert-mma.com/images/og-preview.png'],
    },
  };
}

// 2. Сам компонент макета (тоже должен принимать асинхронные params по спецификации Next.js)
export default async function NewsLayout({ children, params }: LayoutProps) {
  // Просто дожидаемся их для валидации роутинга Next.js
  await params; 
  
  return <>{children}</>;
}
