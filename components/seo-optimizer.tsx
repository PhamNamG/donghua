'use client';

import Script from 'next/script';
import { safeSubstring, FormattedAnimeData } from '@/lib/data-utils';

interface SEOOptimizerProps {
  anime: FormattedAnimeData;
}

export function SEOOptimizer({ anime }: SEOOptimizerProps) {
  const baseUrl = 'https://hh3dtq.site';
  
  // Tối ưu hóa structured data để tránh trùng lặp
  const movieSchema = {
    "@context": "https://schema.org",
    "@type": anime.isMovie === "drama" ? "TVSeries" : "Movie",
    "name": anime.name,
    "alternateName": anime.anotherName,
    "description": safeSubstring(anime.des, 200),
    "image": anime.linkImg,
    "url": `${baseUrl}/phim/${anime.slug}`,
    "datePublished": anime.year,
    "dateCreated": anime.createdAt,
    "dateModified": anime.updatedAt,
    "genre": anime.tags?.map(tag => tag.name) || [],
    "inLanguage": "vi",
    "publisher": {
      "@type": "Organization",
      "name": "Hoạt hình trung quốc",
      "url": baseUrl
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": anime.up,
      "ratingCount": anime.ratingCount || 1,
      "bestRating": 10,
      "worstRating": 1,
    },
    ...(anime.isMovie === "drama" && {
      "numberOfEpisodes": anime.sumSeri,
      "numberOfSeasons": 1,
    }),
    "potentialAction": {
      "@type": "WatchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/phim/${anime.slug}`,
        "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
      },
    },
  };

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
        "name": anime.tags?.[0]?.name || "Anime",
        "item": `${baseUrl}/categories/${anime.tags?.[0]?.slug || 'anime'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": anime.name,
        "item": `${baseUrl}/phim/${anime.slug}`
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hoạt hình trung quốc",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo.png`,
    "sameAs": [
      "https://hh3dtq.site"
    ]
  };

  return (
    <>
      <Script
        type="application/ld+json"
        id="movie-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(movieSchema)
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
        id="organization-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
    </>
  );
} 