// Type checking utilities

import { FormattedAnimeData, formatAnimeData, validateAnimeData } from './data-utils';

// Test function to ensure type compatibility
export function testTypeCompatibility() {
  const mockAnimeData = {
    _id: "test-id",
    name: "Test Anime",
    anotherName: "Test Another Name",
    slug: "test-slug",
    linkImg: "https://example.com/image.jpg",
    des: "Test description",
    sumSeri: "12",
    products: [],
    type: "drama",
    week: { name: "Monday" },
    up: 100,
    year: "2024",
    time: "24 min",
    isActive: 1,
    rating: [],
    ratingCount: 10,
    hour: "20:00",
    season: "Spring",
    lang: "Vietsub",
    quality: "HD",
    comment: [],
    upcomingReleases: "",
    isMovie: "drama",
    searchCount: 50,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    latestProductUploadDate: "2024-01-01",
    relatedSeasons: "related-id",
    tags: [
      { name: "Action", slug: "action" },
      { name: "Adventure", slug: "adventure" }
    ],
    zaloGroupLink: ""
  };

  // Test formatAnimeData
  const formattedData: FormattedAnimeData = formatAnimeData(mockAnimeData);
  
  // Test validation
  const isValid = validateAnimeData(mockAnimeData);
  
  return {
    formattedData,
    isValid,
    tagsType: Array.isArray(formattedData.tags),
    tagsLength: formattedData.tags.length
  };
} 