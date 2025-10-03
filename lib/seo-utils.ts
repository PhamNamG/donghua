import { Anime } from '@/services/api/anime.api';
import { safeSubstring } from './data-utils';

// SEO Utility Functions

export function optimizeTitle(name: string, anotherName: string): string {
    return `${name} - ${anotherName} | Xem phim hoạt hình trung quốc online`;
}

export function optimizeDescription(
    name: string,
    anotherName: string,
    year: string,
    time: string,
    lang: string,
    quality: string,
    description: string
): string {
    const langText = lang === "ThuyetMinh-Vietsub" ? "Thuyết minh + Vietsub" :
        lang === "ThuyetMinh" ? "Thuyết minh" : "Vietsub";

    const descText = safeSubstring(description, 150);

    return `${name} (${anotherName}) - ${year} - ${time}/tập - ${langText} - ${quality}. ${descText}`;
}

export function generateKeywords(
    name: string,
    anotherName: string,
    year: string,
    quality: string,
    tags?: Array<{ name: string }>
): string[] {
    const baseKeywords = [
        `${name} xem online`,
        `${name} vietsub`,
        `${name} thuyết minh`,
        `${name} ${year}`,
        `${name} ${quality}`,
        `${anotherName} xem online`,
        `${anotherName} vietsub`,
        `${anotherName} thuyết minh`,
        ...(tags?.map(tag => `${tag.name} anime`) || []),
        "hoạt hình trung quốc online",
        "anime vietsub",
        "phim hoạt hình mới"
    ];

    return baseKeywords.filter((keyword, index, self) =>
        self.indexOf(keyword) === index
    );
}

export function optimizeImageAlt(name: string, anotherName: string): string {
    return `${name} - ${anotherName} - Phim hoạt hình trung quốc`;
}

export function truncateDescription(description: string, maxLength: number = 200): string {
    return safeSubstring(description, maxLength);
}

export function generateCanonicalUrl(slug: string): string {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/phim/${slug}`;
}

export function generateOpenGraphUrl(slug: string): string {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/phim/${slug}`;
}

// Structured Data Helpers
export function generateMovieSchema(anime:Anime, slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    return {
        "@context": "https://schema.org",
        "@type": anime.isMovie === "drama" ? "TVSeries" : "Movie",
        "name": anime.name,
        "alternateName": anime.anotherName,
        "description": truncateDescription(anime.des || "", 200),
        "image": anime.linkImg,
        "url": `${baseUrl}/phim/${slug}`,
        "datePublished": anime.year,
        "dateCreated": anime.createdAt,
        "dateModified": anime.updatedAt,
        "genre": anime.tags?.map((tag: { name: string }) => tag.name) || [],
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
                "urlTemplate": `${baseUrl}/phim/${slug}`,
                "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
            },
        },
    };
}

export function generateBreadcrumbSchema(anime: {
    name: string, tags: [
        {
            name: string,
            slug: string
        }
    ]
}, slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    return {
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
                "item": `${baseUrl}/phim/${slug}`
            }
        ]
    };
} 