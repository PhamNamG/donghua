import { notFound } from "next/navigation"
import { Metadata } from "next"
import { AnimeClient } from "../anime-client"
import { getAnimeData, getAnimePopular, getCategoryNominated } from "@/services/anime.server";
import { ANIME_PATHS } from "@/constant/path.constant";
import { SEOOptimizer } from "@/components/seo-optimizer";
import { formatAnimeData, validateAnimeData, safeSubstring, FormattedAnimeData } from "@/lib/data-utils";

// export const runtime = 'edge';

type tParams = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: tParams }
): Promise<Metadata> {
  const { slug } = await params

  const animeData = await getAnimeData(slug)

  if (!animeData || !validateAnimeData(animeData)) {
    return {
      title: 'Không tìm thấy',
      description: 'Không tìm thấy anime này'
    }
  }

  const formattedData = formatAnimeData(animeData);

  // Tối ưu title để tránh trùng lặp
  const title = `${formattedData.name} - ${formattedData.anotherName} | Xem phim hoạt hình trung quốc`
  
  // Tối ưu description để unique hơn
  const description = `${formattedData.name} (${formattedData.anotherName}) - ${formattedData.year} - ${formattedData.time}/tập - ${formattedData.lang} - ${formattedData.quality}. ${safeSubstring(formattedData.des, 150)}`
  
  const imageUrl = formattedData.linkImg
  
  // Tối ưu keywords để unique hơn
  const keywords = [
    `${formattedData.name} xem online`,
    `${formattedData.name} vietsub`,
    `${formattedData.name} thuyết minh`,
    `${formattedData.name} ${formattedData.year}`,
    `${formattedData.name} ${formattedData.quality}`,
    `${formattedData.anotherName} xem online`,
    `${formattedData.anotherName} vietsub`,
    `${formattedData.anotherName} thuyết minh`,
    `${formattedData.name} hhpanda`,
    `${formattedData.name} hhninja`,
    `${formattedData.name} hhkungfu`,
    `${formattedData.name} tvhay`,
    `${formattedData.name} animehay`,
    `${formattedData.name} phimmoi`,
    `${formattedData.name} youtube`,
    `${formattedData.name} full`,
    ...(formattedData.tags?.map((tag: { name: string }) => `${tag.name} anime`) || []),
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
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${formattedData.name} - ${formattedData.anotherName}`
      }],
      type: 'video.movie',
      siteName: "Hoạt hình trung quốc",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/phim/${slug}`,
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      site: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      creator: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}${ANIME_PATHS.DETAIL(slug)}`,
    },
    other: {
      'article:author': 'Hoạt hình trung quốc',
      'article:section': formattedData.tags?.[0]?.name || 'Anime',
    }
  }
}

export default async function AnimePage({ params }: { params: tParams }) {
  const { slug } = await params
  const animeData = await getAnimeData(slug)
  const topCategory = await getAnimePopular("150", "250")
  const nominatedData = await getCategoryNominated(animeData?.relatedSeasons, animeData?._id)
  if (!animeData || !validateAnimeData(animeData)) {
    notFound()
  }

  const formattedData: FormattedAnimeData = formatAnimeData(animeData);
  return (
    <>
      <AnimeClient
        anime={formattedData}
        nominatedData={nominatedData}
        topCategory={topCategory}
      />
      <SEOOptimizer anime={formattedData} />
    </>
  )
}
