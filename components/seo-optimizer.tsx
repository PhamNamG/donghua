'use client';

import Script from 'next/script';
import { safeSubstring, FormattedAnimeData } from '@/lib/data-utils';

interface SEOOptimizerProps {
  anime: FormattedAnimeData;
}

export function SEOOptimizer({ anime }: SEOOptimizerProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // Normalize rating value to 1-10 scale based on likes
  // Using proper scaling: convert likes to a 1-10 rating scale
  const calculateRating = (likes: number): number => {
    if (likes <= 0) return 1;
    if (likes <= 10) return Math.max(1, Math.min(10, likes));
    // For likes > 10, use logarithmic scale to map to 1-10
    const rating = 1 + (Math.log10(likes) / Math.log10(1000)) * 9;
    return Math.min(10, Math.max(1, parseFloat(rating.toFixed(1))));
  };
  
  const normalizedRating = calculateRating(anime.up || 0);
  // Ensure ratingCount is reasonable (at least 10% of likes, minimum 1)
  const ratingCount = anime.ratingCount || Math.max(1, Math.floor((anime.up || 0) / 10) || 1);
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
      "ratingValue": normalizedRating,
      "ratingCount": ratingCount,
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