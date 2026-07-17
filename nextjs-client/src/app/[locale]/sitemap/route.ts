import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.couch-expert-mma.com';
  const locales = ['ru', 'en'];

  let tournamentRoutes = '';

  try {
    const response = await fetch('https://api.couch-expert-mma.com/tournaments', {
      next: { revalidate: 3600 }
    });

    if (response.ok) {
      const data = await response.json();
      const tournamentsArray = data.tournaments || [];

      tournamentRoutes = locales.flatMap((locale) =>
        tournamentsArray.map((t: any) => `
        <url>
          <loc>${baseUrl}/${locale}/voting?tournamentId=${t.id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')
      ).join('');
    }
  } catch (e) {
    console.error(e);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <url>
    <loc>${baseUrl}/ru</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/en</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${tournamentRoutes}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
