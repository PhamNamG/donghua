import { notFound } from "next/navigation"
import { Metadata } from "next"
import { WatchClient } from "./watch-client"
import { getAnimeEpisode, getAnimePopular } from "@/services/anime.server"
import { ANIME_PATHS } from "@/constant/path.constant";
import { safeSubstring } from "@/lib/data-utils";
import { WatchSEOOptimizer } from "@/components/watch-seo-optimizer";

// export const runtime = 'edge';

type tParams = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: tParams }
): Promise<Metadata> {
  const { slug } = await params

  const animeData = await getAnimeEpisode(slug)
  if (!animeData) {
    return {
      title: 'Không tìm thấy',
      description: 'Không tìm thấy tập phim này'
    }
  }

  // Tối ưu title để unique hơn
  const title = animeData.category.isMovie === 'drama' 
    ? `${animeData.name} - Tập ${animeData.seri} | Hoạt hình trung quốc`
    : `${animeData.name} | Hoạt hình trung quốc`
  
  const titleOg = animeData.category.isMovie === 'drama' 
    ? `${animeData.name} Tập ${animeData.seri}`
    : animeData.name
  
  // Tối ưu description để unique hơn
  const description = animeData.category.isMovie === 'drama'
    ? `${animeData.name} - Tập ${animeData.seri} - ${animeData.category.year} - ${animeData.category.time}/tập - ${animeData.category.lang} - ${animeData.category.quality}. ${safeSubstring(animeData.category.des, 150)}`
    : `${animeData.name} - ${animeData.category.year} - ${animeData.category.time} - ${animeData.category.lang} - ${animeData.category.quality}. ${safeSubstring(animeData.category.des, 150)}`

  // Tối ưu keywords để unique hơn
  const keywords = [
    `${titleOg} xem online`,
    `${titleOg} vietsub`,
    `${titleOg} thuyết minh`,
    `${titleOg} ${animeData.category.year}`,
    `${titleOg} ${animeData.category.quality}`,
    `${titleOg} hhpanda`,
    `${titleOg} hhninja`,
    `${titleOg} hhkungfu`,
    `${titleOg} tvhay`,
    `${titleOg} animehay`,
    `${titleOg} phimmoi`,
    `${titleOg} youtube`,
    `${titleOg} full`,
    ...(animeData.category.tags?.map((tag: { name: string }) => `${tag.name} anime`) || []),
    "hoạt hình trung quốc online",
    "anime vietsub",
    "phim hoạt hình mới"
  ];

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'video.movie',
      siteName: 'Hoạt hình trung quốc',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/xem-phim/${slug}`,
      locale: "vi_VN",
      images: [{
        url: animeData.category.linkImg || '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [animeData.category.linkImg || '/og-image.jpg'],
      site: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      creator: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}${ANIME_PATHS.WATCH}/${slug}`
    },
    other: {
      'article:author': 'Hoạt hình trung quốc',
      'article:section': animeData.category.tags?.[0]?.name || 'Anime',
    }
  }
}

export default async function WatchPage({ params }: { params: tParams }) {
  const { slug } = await params
  const topCategory = await getAnimePopular("150", "250")
  const animeData = await getAnimeEpisode(slug)
  if (!animeData) {
    notFound()
  }
  return (
    <>
      <WatchClient
        anime={animeData}
        topCategory={topCategory}
      />
      <WatchSEOOptimizer anime={animeData} />
    </>
  )
}
