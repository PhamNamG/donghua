import { baseApi } from './base.api';
import { API_ENDPOINTS } from '../../constant/api.constant';

export interface AnimeProduct {
    _id: string;
    seri: string;
    slug:string
}

export interface Anime {
    _id: string;
    name: string;
    anotherName: string;
    slug: string;
    linkImg: string;
    des: string;
    sumSeri: string;
    products: AnimeProduct[];
    type: string;
    week: string;
    up: number;
    year: string;
    time: string;
    isActive: number;
    rating: any[];
    ratingCount: number;
    hour: string;
    season: string;
    lang: string;
    quality: string;
    comment: any[];
    upcomingReleases: string;
    isMovie: string;
    searchCount: number;
    createdAt: string;
    updatedAt: string;
    latestProductUploadDate: string;
    tags:{
        name:string,
    }[]
}

export interface AnimeResponse {
    data: Anime[]
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export interface AnimeResponseNominated {
    data: Anime[]
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export const animeApi = {
    getLatest: async (): Promise<AnimeResponse> => {
        return baseApi.get<AnimeResponse>(API_ENDPOINTS.ANIME.LATEST);
    },

    getEp2d: async (): Promise<AnimeResponse> => {
        return baseApi.get<AnimeResponse>(API_ENDPOINTS.ANIME.EP2D);
    },

    getPopular: async (width: string, height: string): Promise<AnimeResponse> => {
        return baseApi.get<AnimeResponse>(`${API_ENDPOINTS.ANIME.POPULAR}?width=${width}&height=${height}`);
    },

    getCategory: async (page: number): Promise<AnimeResponse> => {
        return baseApi.get<AnimeResponse>(`${API_ENDPOINTS.ANIME.CATEGORY}?page=${page}`);
    },

    getBySlug: async (slug: string): Promise<Anime> => {
        return baseApi.get<Anime>(`${API_ENDPOINTS.ANIME.BY_SLUG}/${slug}`);
    },

    getEpisode: async (slug: string): Promise<any> => {
        return baseApi.get(`${API_ENDPOINTS.ANIME.EPISODE}/${slug}`);
    },

    search: async (query: string, filters?: { categories?: string[], status?: string }): Promise<AnimeResponse> => {
        let url = `${API_ENDPOINTS.ANIME.SEARCH}?value=${query}`;
        
        if (filters?.categories?.length) {
            url += `&categories=${filters.categories.join(',')}`;
        }
        
        if (filters?.status) {
            url += `&status=${filters.status}`;
        }
        
        return baseApi.get<AnimeResponse>(url);
    },

    getCategoryNominated: async (seriesId: string, categoryId: string): Promise<AnimeResponseNominated> => {
        const queryParams = new URLSearchParams();
        if (seriesId) queryParams.append('seriesId', seriesId);
        if (categoryId) queryParams.append('categoryId', categoryId);
        
        return baseApi.get<AnimeResponseNominated>(`${API_ENDPOINTS.ANIME.CATEGORY_NOMINATED}?${queryParams}`);
    }
}; 