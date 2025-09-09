"use client";

import {
  ArrowLeft,
  Star,
  Calendar,
  ChevronUp,
  ChevronDown,
  CalendarDays,
  Clock3,
  Languages,
  Play,
  Plus,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wrapper } from "@/components/wrapper";
import MVImage from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MVLink from "@/components/Link";
import { ANIME_PATHS } from "@/constant/path.constant";
import { SOCIAL_LINKS } from "@/constant/social.constant";
import { useWatchlistStore } from "@/store/watchlist";
import { FormattedAnimeData } from "@/lib/data-utils";
import Gallery from "./gallery";

export interface AnimeProduct {
  _id: string;
  seri: string;
  isApproved: boolean;
  slug: string;
}


interface AnimeClientProps {
  anime: FormattedAnimeData;
}

export function AnimeClient({ anime }: AnimeClientProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isCompactEpisodes, setIsCompactEpisodes] = useState(true);
  const { addAnime, removeAnime, isInWatchlist } = useWatchlistStore();
  const isInList = isInWatchlist(anime._id);

  const handleWatchlistClick = () => {
    if (isInList) {
      removeAnime(anime._id);
    } else {
      addAnime({
        _id: anime._id,
        name: anime.name,
        linkImg: anime.linkImg,
        slug: anime.slug,
        anotherName: anime.anotherName,
      });
    }
  };

  // Tối ưu hóa thông tin hiển thị để tránh trùng lặp
  const displayInfo = [
    { icon: Star, label: `${anime.up} lượt thích`, value: null, className: "text-yellow-500" },
    { icon: CalendarDays, label: anime.year, value: null },
    { icon: Clock3, label: `${anime.time}/tập`, value: null },
    ...(anime.isMovie === "drama" ? [{ icon: Play, label: `${anime.sumSeri} tập`, value: null }] : []),
    { icon: Languages, label: anime.lang === "ThuyetMinh-Vietsub" ? "Thuyết minh + Vietsub" : anime.lang === "ThuyetMinh" ? "Thuyết minh" : "Vietsub", value: null },
  ];

  // Derive robust airing/completed flags
  const totalEpisodes = Number(anime.sumSeri) || 0;
  const currentEpisodes = Array.isArray(anime.products) ? anime.products.length : 0;
  const statusLower = (anime.status || "").toLowerCase();
  const isCompleted =
    statusLower === "completed" ||
    statusLower === "complete" ||
    (totalEpisodes > 0 && currentEpisodes >= totalEpisodes);
  const isAiring = !isCompleted && (
    statusLower === "pending" ||
    statusLower === "airing" ||
    statusLower === "ongoing" ||
    totalEpisodes === 0 ||
    currentEpisodes < totalEpisodes
  );

  return (
    <>
      {/* Header with background image - Full width */}
      <div className="relative h-[500px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <MVImage
            src={anime.posters.find((poster) => poster.coverPoster === 'cover')?.imageUrl || anime.linkImg}
            alt={`${anime.name} - ${anime.anotherName} - Phim hoạt hình trung quốc`}
            fill
            className="object-cover object-center brightness-[0.5] w-full h-full "
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background md:via-background/50 via-background/0 to-transparent h-[500px] md:h-[400px]" />
        <div className="container relative h-[520px] md:h-[400px] flex flex-col justify-end pb-8 mx-auto">
          <MVLink href="/" className="absolute top-4 left-3 md:left-0 md:top-8">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-background/80 backdrop-blur-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Trở về Trang chủ</span>
              <span className="sm:hidden">Trở về</span>
            </Button>
          </MVLink>
          <div className="flex flex-col md:flex-row gap-6 items-start mt-auto md:mt-0">
            <div className="relative h-[200px] w-[140px] md:h-[240px] md:w-[160px] rounded-lg overflow-hidden shadow-lg mx-auto md:mx-0">
              <MVImage
                src={anime.linkImg}
                alt={`Poster ${anime.name} - ${anime.anotherName}`}
                fill
                className="object-cover w-full h-full"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
                {anime.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <h1 className="text-lg font-bold mb-2 text-white text-center md:hidden">
                {anime.name} <span className="text-white/70 font-normal">- {anime.anotherName}</span>
              </h1>

              <div className="hidden md:block mb-4">
                <h1 className="text-4xl font-bold text-white line-clamp-2">
                  {anime.name}
                </h1>
                <p className="text-base text-white/80 line-clamp-2">
                  {anime.anotherName}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-4 justify-center md:justify-start">
                {displayInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 text-white/90">
                    <item.icon className={`h-4 w-4 ${item.className}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              {isAiring ? (
                <div className="mb-4 justify-center md:justify-start">
                  <div className="relative group inline-flex">
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    {/* Main container */}
                    <div className="relative bg-gradient-to-br from-white/90 to-white/70 dark:from-white/10 dark:to-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {anime.week.map((week) => week.name).join(", ")}, {anime.hour}
                      </span>
                      <div className="ml-2 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : isCompleted ? (
                <div className="mb-4 justify-center md:justify-start">
                  <div className="relative bg-white/5 dark:bg-white/5 border border-white/70 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      Hoàn Thành
                    </span>
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
              ) : null
              }


              {/* 3 buttons in one row on all screen sizes */}
              <div className="flex flex-row gap-2 md:gap-3 md:justify-start justify-center w-full px-2 md:px-0">
                <Button
                  asChild
                  className="flex-1 md:flex-none text-xs md:text-sm px-2 md:px-4"
                >
                  {anime?.isMovie === "drama" ? (
                    <MVLink
                      href={`${ANIME_PATHS.WATCH}/${anime?.products[0]?.slug}`}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Xem ngay</span>
                      <span className="sm:hidden">Xem</span>
                    </MVLink>
                  ) : (
                    <MVLink href={`${ANIME_PATHS.WATCH}/${anime?.products[0]?.slug}`}>
                      <Play className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Xem ngay</span>
                      <span className="sm:hidden">Xem</span>
                    </MVLink>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWatchlistClick}
                  className="flex-1 md:flex-none text-xs md:text-sm px-2 md:px-4"
                >
                  {isInList ? (
                    <Bookmark className="h-4 w-4 mr-1" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  <span className="hidden sm:inline">
                    {isInList ? "Xóa khỏi danh sách" : "Thêm vào danh sách"}
                  </span>
                  <span className="sm:hidden">{isInList ? "Xóa" : "Thêm"}</span>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="cursor-pointer flex-1 md:flex-none text-xs md:text-sm px-2 md:px-4"
                >
                  <a
                    href={SOCIAL_LINKS.ZALO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 md:gap-2"
                  >
                    <MVImage
                      src="/7044033_zalo_icon.svg"
                      width={80}
                      height={80}
                      alt="Zalo"
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                    <span className="hidden sm:inline whitespace-nowrap">
                      Tham gia nhóm Zalo
                    </span>
                    <span className="sm:hidden">Zalo</span>
                  </a>
                </Button>
              </div>
            </div>
            <div>

            </div>
          </div>
        </div>
      </div>

      <Wrapper>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Danh sách tập</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">Rút gọn</span>
              <Switch
                checked={isCompactEpisodes}
                onCheckedChange={setIsCompactEpisodes}
                className="data-[state=checked]:bg-[#FFD875]"
              />
            </div>
          </div>

          {isCompactEpisodes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {anime.products && anime.products.length > 0
                ? anime.products.map((product, index) => (
                  <MVLink href={`${ANIME_PATHS.WATCH}/${anime.slug}`}   key={index}>
                  <div
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-medium">
                          {anime.isMovie === "drama" ? product.seri : "Full"}
                        </div>
                        <div>
                          {anime.isMovie !== "drama" ? (
                            <h3 className="font-medium">Full</h3>
                          ) : (
                            <h3 className="font-medium">
                              Tập {product.seri}
                            </h3>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Đã phát hành
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        asChild
                        disabled={!product.isApproved}
                      >
                        {anime.isMovie === "drama" ? (
                          <div>
                            <Play className="w-4 h-4 lg:block hidden" />
                            <span className="lg:hidden">Xem</span>
                          </div>
                        ) : (
                          <div>
                            <Play className="w-4 h-4 lg:block hidden" />
                            <span className="lg:hidden">Xem</span>
                          </div>
                        )}
                      </Button>
                  </div>
                    </MVLink>
                ))
                : null}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-4 pr-1 max-h-[300px] overflow-y-auto">
              {anime.products && anime.products.length > 0
                ? anime.products.map((product, index) => (
                  <MVLink
                    key={index}
                    href={anime.isMovie === "drama" ? `${ANIME_PATHS.WATCH}/${product.slug}` : `${ANIME_PATHS.WATCH}/${anime.slug}`}
                    className="group block"
                  >
                    <div className="relative rounded-md overflow-hidden border">
                      <div className="h-[100px] w-[200px] mx-auto bg-muted">
                        <div className="relative h-full w-full">
                          <MVImage
                            src={product.thumnail ? product.thumnail : '/images/placeholder_.jpg'}
                            alt={`Tập ${product.seri} - ${anime.name}`}
                            fill
                            sizes="200px"
                            className="object-cover group-hover:brightness-75 transition-all duration-300"
                            priority={index < 4}
                          />

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/60 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      {anime.isMovie !== "drama" ? (
                        <h3 className="text-sm font-medium">Full</h3>
                      ) : (
                        <h3 className="text-sm font-medium">Tập {product.seri}</h3>
                      )}
                    </div>
                  </MVLink>
                ))
                : null}
            </div>
          )}
        </div>
        <Gallery
          images={anime.posters}
          className="mb-6"
        />
        {/* Thông tin chi tiết */}
        <div className="space-y-6 mb-8">
          <Collapsible
            open={isDescriptionOpen}
            onOpenChange={setIsDescriptionOpen}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-3 transition-colors">
              <h2 className="text-xl font-semibold">Nội dung</h2>
              {isDescriptionOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <p className="text-muted-foreground leading-relaxed">
                {anime.des}
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Separator />

        </div>
        {/* Bình luận */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-3">Bình luận</h2>

          {/* Comment Form */}
          <div className="p-4 rounded-lg border mb-6">
            <h3 className="font-medium mb-2">Thêm bình luận</h3>
            <textarea
              className="w-full p-2 border rounded-md mb-2 min-h-[100px]"
              placeholder="Viết bình luận của bạn..."
            />
            <div className="flex justify-end">
              <Button>Đăng bình luận</Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center text-muted-foreground py-8">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}