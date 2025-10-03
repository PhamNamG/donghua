'use client';

import Script from 'next/script';
import { safeSubstring } from '@/lib/data-utils';
import { AnimeProduct } from '@/services/api/anime.api';

interface WatchSEOOptimizerProps {
  anime: {
    name: string;
    slug: string;
    seri: string;
    isApproved: boolean;
    view: number;
    category: {
      _id: string;
      name: string;
      slug: string;
      des: string;
      type: string;
      isMovie: string;
      year: string;
      time: string;
      lang: string;
      quality: string;
      linkImg?: string;
      products: AnimeProduct[];
      combiningEpisodes: {
        name:string
      }[];
      status: string;
      sumSeri: string;
      tags: Array<{ name: string; _id: string }>;
    };
    copyright: string;
    zaloGroupLink?: string;
    createdAt: string;
    prevEpisode: string;
    nextEpisode: string;
  };
}

export function WatchSEOOptimizer({ anime }: WatchSEOOptimizerProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // Tối ưu hóa structured data cho video
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": anime.category.isMovie === 'drama' 
      ? `${anime.name} - Tập ${anime.seri}`
      : anime.name,
    "description": safeSubstring(anime.category.des, 200),
    "thumbnailUrl": anime.category.linkImg,
    "uploadDate": anime.createdAt,
    "duration": anime.category.time,
    "contentUrl": `${baseUrl}/xem-phim/${anime.slug}`,
    "embedUrl": `${baseUrl}/xem-phim/${anime.slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "Hoạt hình trung quốc",
      "url": baseUrl
    },
    "genre": anime.category.tags?.map(tag => tag.name) || [],
    "inLanguage": "vi",
    "isFamilyFriendly": true,
    "potentialAction": {
      "@type": "WatchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/xem-phim/${anime.slug}`,
        "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
      },
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": anime.category.tags?.[0]?.name || "Anime",
        "item": `${baseUrl}/categories/${anime.category.tags?.[0]?._id || 'anime'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": anime.category.name,
        "item": `${baseUrl}/phim/${anime.category.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": anime.category.isMovie === 'drama' ? `Tập ${anime.seri}` : "Full",
        "item": `${baseUrl}/xem-phim/${anime.slug}`
      }
    ]
  };

  // Episode list schema
  const episodeListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Danh sách tập",
    "description": `Danh sách tập phim ${anime.category.name}`,
    "numberOfItems": anime.category.products.length,
    "itemListElement": anime.category.products.map((product: AnimeProduct, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": anime.category.isMovie === 'drama' 
          ? `${anime.category.name} - Tập ${product.seri}`
          : `${anime.category.name} - Full`,
        "url": `${baseUrl}/xem-phim/${product.slug}`,
        "description": safeSubstring(anime.category.des, 100),
        "thumbnailUrl": anime.category.linkImg,
        "duration": anime.category.time,
        "uploadDate": anime.createdAt
      }
    }))
  };

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hoạt hình trung quốc",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo.png`,
    "sameAs": [
      `${baseUrl}`
    ]
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="video-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoSchema)
        }}
      />
      <Script
        type="application/ld+json"
        id="breadcrumb-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <Script
        type="application/ld+json"
        id="episode-list-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(episodeListSchema)
        }}
      />
      <Script
        type="application/ld+json"
        id="organization-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
    </>
  );
} 