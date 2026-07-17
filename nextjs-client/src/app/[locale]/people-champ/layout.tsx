import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Строго Promise для Next.js 15
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params; 
  
  // Подключаем пространство имен "PeopleChamp" из твоего JSON!
  const t = await getTranslations({ locale, namespace: 'PeopleChamp' });

  const champTitle = t('title') || (locale === 'ru' ? 'Народный чемпион' : 'People\'s Champion');
  const champDesc = t('authDescription') || (locale === 'ru' ? 'Голосуй за любимых бойцов проекта' : 'Vote for your favorite fighters');
  
  const siteBrand = 'Couch Expert MMA';

  return {
    title: `${champTitle} | ${siteBrand}`,
    description: champDesc,
    openGraph: {
      title: `${champTitle} | ${siteBrand}`,
      description: champDesc,
      type: 'website',
      url: 'https:// www. couch-expert-mma. com/' + locale + '/people-champ',
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
      title: `${champTitle} | ${siteBrand}`,
      description: champDesc,
      images: ['https://www.couch-expert-mma.com/images/og-preview.png'],
    },
  };
}

export default async function PeopleChampLayout({ children, params }: LayoutProps) {
  await params; 
  return <>{children}</>;
}
