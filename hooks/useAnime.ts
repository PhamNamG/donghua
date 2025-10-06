import { useQuery } from '@tanstack/react-query';
import { animeApi, Anime, AnimeResponse, AnimeResponseNominated } from '@/services/api/anime.api';

export function useAnime() {
	return useQuery<AnimeResponse>({
		queryKey: ['anime'],
		queryFn: () => animeApi.getLatest(),
	});
}

export function useAnimeEp2d() {
	return useQuery<AnimeResponse>({
		queryKey: ['animeEp2d'],
		queryFn: () => animeApi.getEp2d(),
	});
}
export function useAnimeCategory(page: number) {
	return useQuery<AnimeResponse>({
		queryKey: ['category', page],
		queryFn: () => animeApi.getCategory(page),
	});
}

export function useAnimePopular(width: string, height: string) {
	return useQuery<AnimeResponse>({
		queryKey: ['popular', width, height],
		queryFn: () => animeApi.getPopular(width, height),
		staleTime: 1000 * 60 * 60 * 24,
		gcTime: 1000 * 60 * 60 * 24,
	});
}

export function useAnimeById(id: string) {
	return useQuery<Anime>({
		queryKey: ['anime', id],
		queryFn: () => animeApi.getBySlug(id),
	});
}

export function useSearchAnime(query: string, filters: { categories: string[], status: string }) {
	return useQuery({
		queryKey: ['search', query, filters],
		queryFn: () => animeApi.search(query, filters),
		enabled: query.length > 0,
	});
}

export function useCategoryNominated(seriesId: string, categoryId: string) {
	return useQuery<AnimeResponseNominated>({
		queryKey: ['categoryNominated', seriesId, categoryId],
		queryFn: () => animeApi.getCategoryNominated(seriesId, categoryId),
		staleTime: 1000 * 60 * 60 * 24,
		gcTime: 1000 * 60 * 60 * 24,
	});
} 