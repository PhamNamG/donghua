"use client";

import { Play } from "lucide-react";
import MVLink from "@/components/Link";
import { ANIME_PATHS } from "@/constant/path.constant";
import MVImage from "@/components/ui/image";
import { SwitchEpisode } from "./switch-episode";

interface Product {
  _id: string;
  seri: string;
  isApproved: boolean;
  view: number;
  slug: string;
  thumnail?: string;
}

interface EpisodeListProps {
  products: Product[];
  currentSeri: string;
  isMovie: string;
  isCompactEpisodes: boolean;
  setIsCompactEpisodes: (value: boolean) => void;
  episodeListRef?: React.RefObject<HTMLDivElement | null>;
  currentEpisodeRef?: React.RefObject<HTMLDivElement | null>;
  showSwitch?: boolean;
  className?: string;
  height?: string;
  columns?: {
    compact: string;
    compactThumbnail: string;
    normal: string;
  };
  textEpisode?: string;
}

export function EpisodeList({
  products,
  currentSeri,
  isMovie,
  isCompactEpisodes,
  setIsCompactEpisodes,
  episodeListRef,
  currentEpisodeRef,
  showSwitch = true,
  className = "",
  height = "h-[200px]",
  columns = {
    compact: "grid-cols-4 sm:grid-cols-5 md:grid-cols-6",
    compactThumbnail: "grid-cols-2",
    normal: "grid-cols-3"
  },
  textEpisode = "Tập"
}: EpisodeListProps) {
  return (
    <div className={className}>
      {showSwitch && (
        <SwitchEpisode isCompactEpisodes={isCompactEpisodes} setIsCompactEpisodes={setIsCompactEpisodes} />
      )}

      <div className={`${height} scrollbar-custom overflow-y-auto pr-2`} ref={episodeListRef}>
        {isCompactEpisodes ? (
          <div className={`grid ${columns.normal} gap-2`}>
            {products.map((product: Product, index) => (
              <div
                key={index}
                ref={Number(product.seri) === Number(currentSeri) ? currentEpisodeRef : null}
              >
                <MVLink
                  href={
                    isMovie !== "drama"
                      ? `${ANIME_PATHS.WATCH}/${products[0]?.slug}`
                      : `${ANIME_PATHS.WATCH}/${product.slug}`
                  }
                  className={`flex items-center justify-center w-full h-10 rounded-md border transition-all duration-200 text-sm font-medium ${Number(product.seri) === Number(currentSeri)
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background hover:bg-muted border-border hover:border-primary/50'
                    }`}
                >
                  {isMovie === "drama" ? (
                    <>{textEpisode} {product.seri}</>
                  ) : (
                    <>Full</>
                  )}
                </MVLink>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid ${columns.compactThumbnail} gap-2`}>
            {products.length > 0 && products.map((product: Product, index) => (
              <div
                key={index}
                ref={Number(product.seri) === Number(currentSeri) ? currentEpisodeRef : null}
              >
                  <MVLink
                    key={index}
                    href={
                      isMovie === "drama"
                        ? `${ANIME_PATHS.WATCH}/${product.slug}`
                        : `${ANIME_PATHS.WATCH}/${products[0]?.slug}`
                    }
                  className="group block"
                >
                  <div className="relative rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 bg-card dark:bg-card">
                    <div className="aspect-video bg-muted dark:bg-muted/50 relative">
                      <MVImage
                        src={product.thumnail ? product.thumnail : "/images/placeholder_.jpg"}
                        alt={`Tập ${product.seri}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-all duration-300"
                        priority={index < 6}
                      />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 dark:bg-black/50">
                        <div className="bg-primary/90 dark:bg-primary rounded-full p-2 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 px-1">
                    <h3 className="text-sm font-medium text-foreground line-clamp-1">
                      {isMovie !== "drama" ? "Full Movie" : `Tập ${product.seri}`}
                    </h3>
                  </div>
                </MVLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
