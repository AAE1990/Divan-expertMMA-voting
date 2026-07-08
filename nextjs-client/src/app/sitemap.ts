import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://couch-expert-mma.com';
  const locales = ['ru', 'en']; // Твои поддерживаемые языки

  // 1. Статические страницы для всех языков
  const staticPages = ['', '/login', '/registration'];
  const staticRoutes = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: page === '' ? 1.0 : 0.8,
    }))
  );

  // 2. Динамические ссылки на турниры
  let tournamentRoutes: any[] = [];

  try {
    // Запрашиваем турниры напрямую с твоего бэкенда на тарифе Starter
    const response = await fetch('https://api.couch-expert-mma.com/tournaments', {
      next: { revalidate: 3600 } // Кэшируем на 1 час, чтобы беречь процессор
    });

    if (response.ok) {
      const tournaments = await response.json();

      // Генерируем ссылки вида /ru/voting?tournamentId=... и /en/voting?tournamentId=...
      tournamentRoutes = locales.flatMap((locale) =>
        tournaments.map((tournament: any) => ({
          url: `${baseUrl}/${locale}/voting?tournamentId=${tournament.id}`,
          lastModified: new Date(tournament.updatedAt || tournament.createdAt).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      );
    }
  } catch (error) {
    console.error('Ошибка генерации sitemap для турниров:', error);
  }

  return [...staticRoutes, ...tournamentRoutes];
}
