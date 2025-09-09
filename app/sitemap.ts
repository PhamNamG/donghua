import { ANIME_PATHS } from "@/constant/path.constant";
import { fetchCategorySitemap } from "@/services/anime.server";
import type { MetadataRoute } from "next";

export const dynamic = "force-static"

interface Product {
  slug: string;
}

interface Category {
  slug: string;
  products: Product[];
}

const generateSitemapXML = async (): Promise<MetadataRoute.Sitemap> => {
  const categorys: { data: Category[] } = await fetchCategorySitemap(); 

  const sitemap: MetadataRoute.Sitemap = [];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hh3dtq.site';

  categorys?.data?.forEach((item) => {
    sitemap.push({
      url: `${baseUrl}${ANIME_PATHS.BASE}/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });

    // item.products.forEach((product) => {
    //   sitemap.push({
    //     url: `${baseUrl}${ANIME_PATHS.WATCH}/${product?.slug}`,
    //     lastModified: new Date(),
    //     changeFrequency: "daily",
    //     priority: 0.8,
    //   });
    // });
  });

  return sitemap;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const data = await generateSitemapXML();
    return data;
  } catch {
    return []
  }
}
