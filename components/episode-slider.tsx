'use client';

import { Play, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MVLink from '@/components/Link';
import { ANIME_PATHS } from '@/constant/path.constant';
import { FormattedAnimeData } from '@/lib/data-utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import MVImage from '@/components/ui/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface EpisodeSliderProps {
	anime: FormattedAnimeData;
}

export function EpisodeSlider({ anime }: EpisodeSliderProps) {
	if (!anime.products || anime.products.length === 0) {
		return null;
	}

	// Chỉ lấy 6 items đầu tiên
	const limitedProducts = anime.products.slice(0, 6);

	return (
		<div className="w-full mb-6">
			<h2 className="text-xl font-semibold mb-4">Tập mới cập nhật</h2>
			<Swiper
				modules={[Navigation, Pagination]}
				spaceBetween={16}
				slidesPerView={2}
				navigation={true}
				pagination={{ clickable: true }}
				breakpoints={{
					640: {
						slidesPerView: 3,
						spaceBetween: 16,
					},
					768: {
						slidesPerView: 4,
						spaceBetween: 16,
					},
					1024: {
						slidesPerView: 5,
						spaceBetween: 16,
					},
					1280: {
						slidesPerView: 6,
						spaceBetween: 16,
					},
				}}
				className="episode-swiper"
			>
				{limitedProducts.map((product, index) => (
					<SwiperSlide key={index}>
						<div className="group relative bg-card rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 shadow-lg">
							{/* Episode thumbnail image */}
							<div className="relative aspect-video overflow-hidden">
								{anime.posters && anime.posters.length > 0 ? (
									<>
										<MVImage
											src={anime.posters[0].imageUrl || anime.linkImg}
											alt={anime.isMovie === "drama" ? `Tập ${product.seri}` : "Full"}
											width={300}
											height={169}
											className="w-full h-full object-cover"
										/>
										{/* Gradient overlay for better text readability */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
									</>
								) : (
									<>
										<MVImage
											src={anime.linkImg}
											alt={anime.isMovie === "drama" ? `Tập ${product.seri}` : "Full"}
											width={300}
											height={169}
											className="w-full h-full object-cover"
										/>
										{/* Gradient overlay for better text readability */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
									</>
								)}

								{/* Time indicator - top left */}
								{/* <div className="absolute top-3 left-3 flex items-center gap-1 text-white text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{anime.time}</span>
                </div> */}

								{/* Menu button - top right */}
								{/* <div className="absolute top-3 right-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div> */}

								{/* Episode number - bottom right */}
								<div className="absolute bottom-3 right-3">
									<div className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded">
										{index === 0 ? "New/" + anime.products[0].seri : (anime.isMovie === "drama" ? `Tập ${product.seri}` : "Full")}
									</div>
								</div>

								{/* Play button overlay on hover */}
								<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
									<Button
										size="lg"
										asChild
										disabled={!product.isApproved}
										className="bg-primary hover:bg-primary/90 h-12 w-12 rounded-full"
									>
										{anime.isMovie === "drama" ? (
											<MVLink
												href={`${ANIME_PATHS.WATCH}/${product.slug}`}
												className="flex items-center justify-center"
											>
												<Play className="w-6 h-6 ml-1" />
											</MVLink>
										) : (
											<MVLink
												href={`${ANIME_PATHS.WATCH}/${anime.slug}`}
												className="flex items-center justify-center"
											>
												<Play className="w-6 h-6 ml-1" />
											</MVLink>
										)}
									</Button>
								</div>
							</div>

							{/* Episode info below thumbnail */}
							<div className="p-4 bg-card">
								{/* Anime title */}
								<h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
									{anime.name}
								</h3>

								{/* Views and tags */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1 text-muted-foreground text-sm">
										<Flame className="w-4 h-4 text-red-500" />
										<span>1.3k</span>
									</div>

									{/* Tags */}
									<div className="flex gap-1">
										{anime.tags && anime.tags.slice(0, 2).map((tag, tagIndex) => (
											<span
												key={tagIndex}
												className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
											>
												{tag.name}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
