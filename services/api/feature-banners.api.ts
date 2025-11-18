import { baseApi } from './base.api';
import { API_ENDPOINTS } from '@/constant/api.constant';

export interface FeatureBannerCategory {
  _id: string;
  name: string;
  linkImg: string;
  sumSeri: string;
  anotherName: string;
  lang: string;
  quality: string;
  slug: string;
}

export interface FeatureBanner {
  _id: string;
  category: FeatureBannerCategory;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureBannersResponse {
  data: FeatureBanner[];
  total: number;
}

export const featureBannersApi = {
  getAll: async (): Promise<FeatureBannersResponse> => {
    return baseApi.get<FeatureBannersResponse>(API_ENDPOINTS.FEATURE_BANNERS.ALL);
  }
};

