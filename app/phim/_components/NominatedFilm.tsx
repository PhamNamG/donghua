import MVImage from "@/components/ui/image";
import MVLink from "@/components/Link";
import { ANIME_PATHS } from "@/constant/path.constant";
import { Anime, AnimeResponse } from "@/services/api/anime.api";

export default function NominatedFilmSidebar({ topCategory }: { topCategory: AnimeResponse[] }) {

	// if (animePopularIsLoading) {
	// 	return (
	// 		<div className="w-full lg:w-80 bg-muted/30 rounded-lg p-4 sticky top-4">
	// 			<h3 className="text-lg font-semibold mb-4 text-foreground">Phim Liên Quan</h3>
	// 			<div className="space-y-3">
	// 				{Array.from({ length: 6 }).map((_, index) => (
	// 					<div key={index} className="flex gap-3 p-2 rounded-lg">
	// 						<Skeleton className="w-16 h-20 rounded-md" />
	// 						<div className="flex-1 space-y-2">
	// 							<Skeleton className="h-4 w-full" />
	// 							<Skeleton className="h-3 w-3/4" />
	// 							<Skeleton className="h-3 w-1/2" />
	// 						</div>
	// 					</div>
	// 				))}
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className="w-full lg:w-80 bg-muted/30 rounded-lg p-4 sticky top-4">
			<h3 className="text-lg font-semibold mb-4 text-foreground">Phim Liên Quan</h3>
			<div className="space-y-3">
				{topCategory?.map((response: AnimeResponse) => 
					response.data?.map((anime: Anime) => (
					<MVLink
						key={anime._id}
						href={`${ANIME_PATHS.BASE}/${anime.slug}`}
						className="block group"
					>
						<div className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
							<div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden">
								<MVImage
									src={anime.linkImg || "/placeholder.svg"}
									alt={anime.name}
									fill
									sizes="64px"
									className="object-cover group-hover:scale-105 transition-transform duration-200"
								/>
								{anime.isMovie !== "drama" && (
									<div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] px-1 py-0.5 rounded">
										Movie
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
									{anime.name}
								</h4>
								<p className="text-xs text-muted-foreground line-clamp-1 mt-1">
									{anime.anotherName || anime.year}
								</p>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs text-muted-foreground">{anime.year}</span>
									{anime.quality && anime.quality !== "undefined" && (
										<>
											<span className="text-xs text-muted-foreground">•</span>
											<span className="text-xs text-muted-foreground">{anime.quality}</span>
										</>
									)}
								</div>
							</div>
						</div>
					</MVLink>
					))
				).flat()}
			</div>
		</div>
	);
}
