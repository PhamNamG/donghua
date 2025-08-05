export interface AnimeTag {
    name: string;
    slug: string;
}

export interface FormattedAnimeData {
    _id: string;
    name: string;
    anotherName: string;
    slug: string;
    linkImg: string;
    des: string;
    sumSeri: string;
    products: {
        name: string;
        slug: string;
        seri: string;
        isApproved: boolean;
    }[];
    type: string;
    week: {
        name: string
    };
    up: number;
    year: string;
    time: string;
    isActive: number;
    ratingCount: number;
    hour: string;
    season: string;
    lang: string;
    quality: string;
    upcomingReleases: string;
    isMovie: string;
    searchCount: number;
    createdAt: string;
    updatedAt: string;
    latestProductUploadDate: string;
    relatedSeasons: string;
    tags: AnimeTag[];
    zaloGroupLink: string;
}

export function safeString(value: string) {
    return typeof value === 'string' ? value : '';
}

export function safeSubstring(value: string | undefined | null, maxLength: number): string {
    if (!value || typeof value !== 'string') return '';
    return value.length > maxLength ? value.substring(0, maxLength) + "..." : value;
}

export function safeNumber(value: number) {
    return typeof value === 'number' && !isNaN(value) ? value : 0;
}

export function safeArray<T>(value: T[] = []): T[] {
    return Array.isArray(value) ? value : [];
}

export function safeObject(value = {}) {
    return typeof value === 'object' && value !== null ? value : {};
}

export function safeTags(value: AnimeTag[]) {
    if (!Array.isArray(value)) return [];
    return value.filter(tag =>
        typeof tag === 'object' &&
        tag !== null &&
        typeof tag.name === 'string' &&
        typeof tag.slug === 'string'
    );
}

export function formatAnimeData(anime: FormattedAnimeData) {
    return {
        _id: safeString(anime._id),
        name: safeString(anime.name),
        anotherName: safeString(anime.anotherName),
        slug: safeString(anime.slug),
        linkImg: safeString(anime.linkImg),
        des: safeString(anime.des),
        sumSeri: safeString(anime.sumSeri),
        products: safeArray(anime.products),
        type: safeString(anime.type),
        week: anime.week && typeof anime.week === 'object' && 'name' in anime.week 
            ? { name: safeString(anime.week.name) }
            : { name: '' },
        up: safeNumber(anime.up),
        year: safeString(anime.year),
        time: safeString(anime.time),
        isActive: safeNumber(anime.isActive),
        ratingCount: safeNumber(anime.ratingCount),
        hour: safeString(anime.hour),
        season: safeString(anime.season),
        lang: safeString(anime.lang),
        quality: safeString(anime.quality),
        upcomingReleases: safeString(anime.upcomingReleases),
        isMovie: safeString(anime.isMovie),
        searchCount: safeNumber(anime.searchCount),
        createdAt: safeString(anime.createdAt),
        updatedAt: safeString(anime.updatedAt),
        latestProductUploadDate: safeString(anime.latestProductUploadDate),
        relatedSeasons: safeString(anime.relatedSeasons),
        tags: safeTags(anime.tags),
        zaloGroupLink: safeString(anime.zaloGroupLink),
    };
}

export function validateAnimeData(anime: unknown): boolean {
    return !!(
        anime &&
        typeof anime === 'object' &&
        anime !== null &&
        'name' in anime &&
        'slug' in anime &&
        '_id' in anime
    );
} 