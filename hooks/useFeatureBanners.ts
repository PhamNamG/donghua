import { useQuery } from '@tanstack/react-query';
import { featureBannersApi, FeatureBannersResponse } from '@/services/api/feature-banners.api';

export function useFeatureBanners() {
  return useQuery<FeatureBannersResponse>({
    queryKey: ['feature-banners'],
    queryFn: () => featureBannersApi.getAll(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}





