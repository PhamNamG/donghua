import { ANIME_PATHS, OTHER_PATHS } from "@/constant/path.constant";
import { fetchCategorySitemap } from "@/services/anime.server";
interface Product {
  slug: string;
}

interface Category {
  slug: string;
  products: Product[];
}

export default async function sitemap() {
  const categorys: { data: Category[] } = await fetchCategorySitemap(); 

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hh3dtq.site";

  const urls: { url: string; lastModified: Date; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [];

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}${OTHER_PATHS.ABOUT}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}${OTHER_PATHS.CONTACT}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}${OTHER_PATHS.HELP}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  urls.push(...staticPages);

  // Dynamic category pages
  categorys?.data?.forEach((item) => {
    urls.push({
      url: `${baseUrl}${ANIME_PATHS.BASE}/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // Nếu muốn thêm từng product thì bật đoạn này
    // item.products.forEach((product) => {
    //   urls.push({
    //     url: `${baseUrl}${ANIME_PATHS.WATCH}/${product.slug}`,
    //     lastModified: new Date(),
    //     changeFrequency: 'daily',
    //     priority: 0.8,
    //   });
    // });
  });

  return urls;
}
